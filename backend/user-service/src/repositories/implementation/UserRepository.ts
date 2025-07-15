import {
  PrismaClient,
  Role,
  AuthProvider,
  User as PrismaUser,
  OrganizerRequest,
  Prisma,
} from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { AllUsers, IUser } from '../../shared/types/IUser';
import { deleteCache, getCache, setCache } from '../../shared/utils/cache';

const prisma = new PrismaClient();

function mapUser(user: PrismaUser & { organizer?: OrganizerRequest | null }): IUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    googleId: user.googleId,
    phoneNumber: user.phoneNumber ?? undefined,
    image: user.image ?? undefined,
    authProvider: user.authProvider,
    roles: user.roles,
    isBlocked: user.isBlocked,
    isVerified: user.isVerified,
    organizer: user.organizer ?? undefined,
    organizerId: user.organizerId ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export class UserRepository implements IUserRepository {
  async findByID(id: string): Promise<IUser | undefined> {
    const cacheKey = `user:id:${id}`;
    const cached = await getCache<IUser>(cacheKey);
    if (cached) return cached;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { organizer: true },
    });

    if (user) {
      const mapped = mapUser(user);
      await setCache(cacheKey, mapped);
      return mapped;
    }
  }

  async findByEmail(email: string, authProvider?: string): Promise<IUser | undefined> {
    const cacheKey = `user:email:${email}:${authProvider ?? 'any'}`;
    const cached = await getCache<IUser>(cacheKey);
    if (cached) return cached;

    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        ...(authProvider ? { authProvider: authProvider as AuthProvider } : {}),
      },
      include: { organizer: true },
    });

    if (user) {
      const mapped = mapUser(user);
      await setCache(cacheKey, mapped);
      return mapped;
    }
  }

  async create(item: Partial<IUser>): Promise<IUser> {
    const user = await prisma.user.create({
      data: {
        firstName: item.firstName!,
        lastName: item.lastName!,
        email: item.email!,
        password: item.password,
        googleId: item.googleId,
        authProvider: item.authProvider as AuthProvider,
        roles: item.roles as Role[],
        phoneNumber: item.phoneNumber ? BigInt(item.phoneNumber) : undefined,
        image: item.image,
        isBlocked: item.isBlocked ?? false,
        isVerified: item.isVerified ?? false,
        organizerId: item.organizerId,
      },
    });

    const mapped = mapUser(user);
    await deleteCache(`user:email:${user.email}:${item.authProvider ?? 'any'}`);
    return mapped;
  }

  async update(id: string, item: Partial<IUser>): Promise<void> {
    const { ...rest } = item;
    await prisma.user.update({
      where: { id },
      data: {
        ...(rest.firstName && { firstName: rest.firstName }),
        ...(rest.lastName && { lastName: rest.lastName }),
        ...(rest.password !== undefined && { password: rest.password }),
        ...(rest.googleId && { googleId: rest.googleId }),
        ...(rest.authProvider && { authProvider: rest.authProvider as AuthProvider }),
        ...(rest.roles && { roles: rest.roles as Role[] }),
        ...(rest.phoneNumber !== undefined && { phoneNumber: rest.phoneNumber }),
        ...(rest.image && { image: rest.image }),
        ...(rest.isBlocked !== undefined && { isBlocked: rest.isBlocked }),
        ...(rest.isVerified !== undefined && { isVerified: rest.isVerified }),
        ...(rest.organizerId && { organizerId: rest.organizerId }),
      },
    });

    await deleteCache(`user:id:${id}`);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
    await deleteCache(`user:id:${id}`);
  }

  async getAllUsers(
    search: string,
    page: number,
    limit: number,
    role?: string,
    status?: string,
    myId?: string
  ): Promise<AllUsers> {
    const cacheKey = `user:list:${search}:${page}:${limit}:${role}:${status}:${myId}`;
    const cached = await getCache<AllUsers>(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;

    const filters: Prisma.UserWhereInput = {
      ...(search
        ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {}),
      ...(role ? { roles: { has: role as Role } } : {}),
      ...(status === 'blocked' ? { isBlocked: true } : {}),
      ...(status === 'active' ? { isBlocked: false } : {}),
      ...(myId ? { NOT: { id: myId } } : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where: filters }),
      prisma.user.findMany({
        where: filters,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const result = { users, total };
    await setCache(cacheKey, result, 300);
    return result;
  }

  async updateProfileImage(id: string, image: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { image },
    });
    await deleteCache(`user:id:${id}`);
  }

  async updateUser(
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: number,
    roles?: string[],
    isBlocked?: boolean
  ): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        phoneNumber: BigInt(phoneNumber),
        ...(roles && { roles: roles as Role[] }),
        ...(typeof isBlocked === 'boolean' && { isBlocked }),
      },
    });
    await deleteCache(`user:email:${email}:any`);
  }

  async addRole(id: string, role: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return;

    const updatedRoles = Array.from(new Set([...(user.roles || []), role as Role]));

    await prisma.user.update({
      where: { id },
      data: { roles: updatedRoles },
    });
    await deleteCache(`user:id:${id}`);
  }

  async getBulkUsers(ids: string[]): Promise<IUser[]> {
    const users = await prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, firstName: true, lastName: true, image: true },
    });

    return users.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image ?? undefined,
      email: '',
      password: null,
      googleId: null,
      authProvider: 'email',
      roles: [],
      isBlocked: false,
      isVerified: false,
      organizer: undefined,
      organizerId: undefined,
      createdAt: new Date().toISOString(),
    }));
  }
}
