export enum HttpResponse {
    MESSAGE_SENT = "Message sent",
    MESSAGE_READ = "Messages read",
    MESSAGES_FETCHED = "Fetched messages",
    NOTIFICATION_FETCHED = "Fetched notifications",
    USER_ID_REQUIRED = "User ID and peer ID required",
    ID_MISSING = "User ID is missing",
    NO_INTERACTIONS = "No Interactions found",
    INTERACTIONS_FOUND = "Interactions found",
    ALL_READ = "All notifications marked as read",
    IDENTITY_MISSING = "Missing identity or room",
    TOKEN_CREATED = "Token created",
    INTERNAL_SERVER_ERROR = "Internal server error",
    SSE_CONECTION_ERROR = "Could not establish SSE connection"
}