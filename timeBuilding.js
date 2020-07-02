const buildButton = document.getElementById("build-button");
const totalTimeBuilding = document.getElementById("total-time-building");
const nowBuilding = document.getElementById("now-building");

const setBuildButtonText = () =>
    chrome.storage.sync.get("currentBuild", ({ currentBuild }) => {
        buildButton.innerText = currentBuild.building
            ? "Done building"
            : "Start build";
    });

const formatToTwo = (str) => (str.length < 2 ? `0${str}` : str);

const setTotalTimeBuildingText = () =>
    chrome.storage.sync.get("timeSpentBuilding", ({ timeSpentBuilding }) => {
        const oneHour = 1000 * 60 * 60;
        const oneMinute = 1000 * 60;
        const oneSecond = 1000;

        const hours = "" + Math.floor(timeSpentBuilding / oneHour);
        const minutes = "" + (Math.floor(timeSpentBuilding / oneMinute) % 60);
        const seconds = "" + (Math.floor(timeSpentBuilding / oneSecond) % 60);

        const formattedHours = formatToTwo(hours);
        const formattedMinutes = formatToTwo(minutes);
        const formattedSeconds = formatToTwo(seconds);

        totalTimeBuilding.innerText = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    });

setBuildButtonText();
setTotalTimeBuildingText();

/**
 * @param {HTMLElement} element
 */
buildButton.onclick = (element) => {
    chrome.storage.sync.get("currentBuild", ({ currentBuild }) => {
        if (!currentBuild.building) {
            // We have started building
            const newCurrentBuild = {
                startTime: Date.now(),
                building: !currentBuild.building,
            };
            chrome.storage.sync.set({ currentBuild: newCurrentBuild }, () => {
                setBuildButtonText();
            });
        } else {
            // We are done building
            const newCurrentBuild = {
                startTime: 0,
                building: !currentBuild.building,
            };

            chrome.storage.sync.get(
                "timeSpentBuilding",
                ({ timeSpentBuilding }) => {
                    const newTimeSpentBuilding =
                        Date.now() - currentBuild.startTime + timeSpentBuilding;

                    chrome.storage.sync.set(
                        {
                            currentBuild: newCurrentBuild,
                            timeSpentBuilding: newTimeSpentBuilding,
                        },
                        () => {
                            setBuildButtonText();
                            setTotalTimeBuildingText();
                        }
                    );
                }
            );
        }
    });
};
