import githubActivity from "./src"
import MaskRepository from "./src/assets/masks"


let startDate = "2020-05-19"
let mask = MaskRepository.UA_COAT_OF_ARMS

let gh = githubActivity(mask, startDate, './tmp/commits.sh')

// // gh.setMessages(["MAJOR updates","MINOR update","PATCH"])
// // gh.setFileNames(["debug.app.log","app-web.log","notes-app.md"])

gh.printToFile()

// gh.execute()
