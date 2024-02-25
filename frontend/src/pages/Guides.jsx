import React, { useState } from "react";

const Guides = () => {
    const [ntfyGuidAccordionOpen, setNtfyGuidAccordionOpen] = useState(false);
    const [bannedAccordionOpen, setBannedAccordionOpen] = useState(false);

    const toggleNtfyAccordion = () => {
        setNtfyGuidAccordionOpen(!ntfyGuidAccordionOpen);
    };

    const toggleBannedAccordion = () => {
        setBannedAccordionOpen(!bannedAccordionOpen);
    }

    return (
        <div className="text-center bg-zinc-900 min-h-screen p-4">
            <h1 className="text-5xl font-bold text-white mb-4">Personal Calendar Guides</h1>
            <p className="text-white">You can find all the guides here.</p>

            <div className="flex flex-col items-center my-4">
                <button
                    className={`w-full lg:w-1/2 text-left p-4 bg-zinc-700 0 flex justify-between items-center ${ntfyGuidAccordionOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
                    onClick={toggleNtfyAccordion}>
                    <h1 className="text-center text-lg font-bold lg:text-2xl lg:text-left text-amber-600">
                        Ntfy guide for receiving notifications.
                    </h1>
                </button>
                {ntfyGuidAccordionOpen && (
                    <div className="w-full lg:w-1/2 p-4 bg-zinc-800 text-left text-white">
                        <h1 className="text-3xl font-bold">1. Setup an ntfy account.</h1>
                        <p className="ml-1 mb-4">Head over to
                            <a className="text-blue-500" href="https://ntfy.sh"> ntfy.sh </a>
                            and create your account by singing up.</p>

                        <h1 className="text-3xl font-bold">2. Install the ntfy app.</h1>
                        <div className="ml-4">
                            <h2 className="text-2xl">1. Android or iOS.</h2>
                            <p>Depending on your phone, install the application from your respective
                                store.</p>

                            <div className="flex flex-row space-x-4 p-4 w-1/2">
                                <a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy">
                                    <img alt="Get it on Google Play"
                                         src={require("../images/GetItOnGooglePlay.png")}
                                         width="168" height="50" decoding="async" data-nimg="1" loading="lazy"
                                         style={{color: "transparent"}}/>
                                </a>

                                <a href="https://apps.apple.com/us/app/ntfy/id1625396347">
                                    <img alt="Download on the App Store"
                                         src={require("../images/DownloadOnAppTheStore.png")}
                                         width="148" height="50" decoding="async" data-nimg="1" loading="lazy"
                                         style={{color: "transparent"}}/>
                                </a>
                            </div>

                            <h2 className="text-2xl">2. Computer or laptop.</h2>
                            <p className="mb-2">If you want to receive messages on your computer, you will have to use
                                the <a
                                    className="text-blue-500" href="https://ntfy.sh/app">web application</a> and grant
                                ntfy to display
                                desktop notifications.</p>
                        </div>

                        <h1 className="text-3xl font-bold">3. Subscribe to topic.</h1>
                        <div className="ml-4">
                            <h2 className="text-2xl">1. Android or iOS.</h2>
                            <ol className="list-decimal list-inside ml-4">
                                <li>Open the ntfy app and in the bottom left you are going to see a plus button. Click
                                    on it.
                                </li>
                                <li>In the input field you can specify the the name of the topic you want to use.</li>
                                <li>After that click on the subscribe button.</li>
                            </ol>

                            <h2 className="text-2xl">2. Computer or laptop.</h2>
                            <ol className="list-decimal list-inside ml-4 mb-4">
                                <li>Head over to the <a className="text-blue-500" href="https://ntfy.sh/app">web
                                    application</a>.
                                </li>
                                <li>In the left side you can see a "Subscribe to topic". Click on it.</li>
                                <li>In the input field you can specify the the name of the topic you want to use or let
                                    ntfy generate one for you.
                                </li>
                                <li>After that click on the subscribe button.</li>
                            </ol>
                        </div>

                        <h1 className="text-3xl font-bold">4. Add ntfy to your account.</h1>
                        <ol className="list-decimal list-inside ml-4 mb-4">
                            <li>Head over to your <a className="text-blue-500" href="/profile">profile settings</a>.
                            </li>
                            <li>Click on the edit button to allow editing.</li>
                            <li>In the ntfy input field you can specify the topic name you just subscribed to.</li>
                            <li>Click on the save button to save your changes.</li>
                        </ol>

                        <h1 className="text-3xl font-bold">5. Done.</h1>
                        <p className="ml-1">You are now ready to receive notifications on your device. When creating
                            a new event, you can specify when you want to receive a notification prior to event start
                            time.
                            You can choose from the following options:</p>

                        <ol className="list-decimal list-inside ml-4">
                            <li>5 minutes.</li>
                            <li>10 minutes.</li>
                            <li>15 minutes.</li>
                            <li>30 minutes.</li>
                            <li>1 hour.</li>
                            <li>1 day.</li>
                        </ol>

                        <p className="mt-4">
                            For more details and information, refer to the <a className="text-blue-500">ntfy docs </a>
                            about subscribing to topics and receiving notifications.
                        </p>
                    </div>
                )}

                <button
                    className={`w-full lg:w-1/2 text-left p-4 bg-zinc-700 0 flex justify-between mt-12 items-center ${bannedAccordionOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
                    onClick={toggleBannedAccordion}>
                    <h1 className="text-center text-xl font-bold lg:text-2xl lg:text-left text-amber-600">
                        I got banned. How do I dispute the ban?
                    </h1>
                </button>
                {bannedAccordionOpen && (
                    <div className="w-full lg:w-1/2 p-4 bg-zinc-800 text-left text-white">
                        <h1 className="text-3xl font-bold">1. Contact support.</h1>
                        <p className="ml-1 mb-4">You can contact the support team by sending an email to <a
                            className="text-blue-500"
                            href="mailto:banappeals@personalcalendar.me">
                                banappeals@personalcalendar.me
                            </a>. Make sure to include your username and the reason why you think the ban was made in error.
                        </p>

                        <h1 className="text-3xl font-bold">2. Wait for response.</h1>
                        <p className="ml-1 mb-4">After sending the email, wait for the support team to respond to your
                            case. The support team will review your case and get back to you as soon as possible.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Guides;