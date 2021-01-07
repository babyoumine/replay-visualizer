const osuReplayParser = require('osureplayparser');
const fs = require('fs');

const replayPath = "./replay.osr";
const replay = osuReplayParser.parseReplay(replayPath);

let frames = replay.replay_data;

let identifier = 0;

let final = [];

for(let framesI = 0; framesI < frames.length; framesI++) {
    if(frames[framesI - 1] || frames[framesI].timeSinceLastAction >= 1) {
        frames[framesI].id = identifier; 
        identifier++;
        let xDifference = (frames[framesI].x - frames[framesI - 1].x)/frames[framesI].timeSinceLastAction;
        let yDifference = (frames[framesI].y - frames[framesI - 1].y)/frames[framesI].timeSinceLastAction;
        for(let frameI = 0; frameI < frames[framesI].timeSinceLastAction; frameI++) {
            let frame = {}
            frame.x = frames[framesI - 1].x + (xDifference * (frameI + 1));
            frame.y = frames[framesI - 1].y + (yDifference * (frameI + 1));
            frame.id = identifier; 
            
            identifier++;
            final.push(frame);
        }
    } else if(frames[framesI].x < 0 || frames[framesI].y < 0) {
        delete frames[framesI];
        continue;
    }
    if(!frames[framesI].hasOwnProperty("id")) {
        frames[framesI].id = identifier; identifier++;
    }
}

final.push(frames)

final = final.sort((a, b) => {
    return a.id - b.id;
})

fs.writeFile("boobies.json", JSON.stringify(final), err => {
    if(err) throw err;
    console.log("done")
});

console.log(final)