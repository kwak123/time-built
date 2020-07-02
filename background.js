chrome.runtime.onInstalled.addListener(function () {
    // chrome.storage.sync.set({ color: "#3aa757" }, function () {
    //     console.log("The color is green.");
    // });

    chrome.storage.sync.set(
        {
            timeSpentBuilding: 0,
            currentBuild: { building: false, startTime: 0 },
        },
        () => console.log("installed!")
    );

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: "*" },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});
