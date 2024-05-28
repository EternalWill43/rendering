function Init() {

}

function RenderScene() {
    let CenterX = CanvasWidth / 2;
    let CenterY = CanvasHeight / 2;

    let TotalLines = 5;
    for (let i = -TotalLines; i <= TotalLines; i++) {
        let OffsetX = Math.cos(TotalTime * i * (0.25 / TotalLines)) * 100;
        let OffsetY = Math.sin(TotalTime * i * (0.25 / TotalLines)) * 100;

        let Color = { R: 16, G: 128, B: 256 };
        RenderLine(CenterX - OffsetX, CenterY - OffsetY, CenterX + OffsetX, CenterY + OffsetY, i, Color);
    }
}