const button = document.querySelector("button")

button.addEventListener("click", () => {
    Notification.requestPermission().then(perm => {
        if (perm === "granted"){
            const notification = new Notification("Example Notification", {
                body: Math.random(),
                data: { hello: "world"},
                icon: "S.jpg",
                tag: "Welcome Message",
            })
    
            notification.addEventListener("error", e => {
                alert("Please Grant Me Notifications")
            })
        }
    })
})

let notification
let interval
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden"){
        const leaveDate = new Date()
        interval = setInterval(() => {
            notification =  new Notification("Come Back You",{
                body: `I SEE YOU :) \n You have been gone for ${Math.round(
                    (new Date() - leaveDate) / 1000
                )} seconds`,
                tag: "Come Back"
            })
        }, 100)

    } else {
        if (interval) clearInterval(interval)
        if (notification) notification.close()
    }
})