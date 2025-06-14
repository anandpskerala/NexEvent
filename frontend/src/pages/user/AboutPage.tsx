import { Users, Lightbulb, Globe } from 'lucide-react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { NavBar } from '../../components/partials/NavBar';
import { Footer } from '../../components/partials/Footer';

const AboutPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} section='about'/>
            <div className="mt-20 bg-gray-50">
                <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Shaping the Future of Event
                            <br />
                            Experiences
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            NextEvent connects people with extraordinary experiences and empowers
                            event creators to share their passion with the world. Our mission is to build a
                            platform where everyone can discover and participate in events that inspire,
                            educate, and entertain.
                        </p>
                    </div>
                </div>

                <div className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Our Mission & Values
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                We believe in the power of shared experiences to transform lives and
                                communities. Our platform is built on these core values that guide
                                everything we do.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Community First</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We build technology that fosters genuine
                                    connections and strengthens
                                    communities through shared experiences
                                    and memorable moments.
                                </p>
                            </div>

                            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lightbulb className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We constantly push boundaries to create
                                    intuitive solutions that make discovering
                                    and hosting events seamless and
                                    enjoyable.
                                </p>
                            </div>

                            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Globe className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusivity</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    We're committed to making our platform
                                    accessible to everyone, celebrating
                                    diversity in all forms of events and
                                    experiences.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Discover Exceptional Events?
                        </h2>
                        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
                            Join millions of event enthusiasts already using NextEvent to discover
                            and attend events that match their interests and passions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                                Get Started
                            </button>
                            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-300">
                                For Event Creators
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AboutPage