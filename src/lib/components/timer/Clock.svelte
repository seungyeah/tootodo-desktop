
<script>
    ///////////////// var //////////////////
    // svg settings
    // circle
    const r = 50;
    const cx = 65;
    const cy = 65;

    // viewbox
    const vw=cx*2;
    const vh=cy*2;

    // component settings
    let lines = [];

    // time

    ///////////////// code //////////////////
    for (let i = 0; i < 60; i += 1) {
        let line = new AddLine();
        line.time = 60-i;
        line.angle = 6 * i;

        if( i%5 === 0) {
            line.stroke_width = "thick"
            if(i==0)
                line.text = i.toString();
            else
                line.text = i.toString();
        }
        lines.push(line);
    }
    // console.log(lines);

    ///////////////// function //////////////////
    //line constructor
    function AddLine(){
        this.time = 0;
        this.angle=0;
        this.text="";
        this.stroke_width="thin";
    }

    //line의 angle에 따라 line의 좌표를 구한다.
    function getLineCoordinates(line) {
        const radians = line.angle * Math.PI / 180;
        const x1 = cx + Math.sin(radians) * r;
        const y1 = cy - Math.cos(radians) * r;
        const x2 = cx + Math.sin(radians) * (r - 0.1*r);
        const y2 = cy - Math.cos(radians) * (r - 0.1*r);
        return { x1, y1, x2, y2 };
    }

    //TODO:line의 angle에 따라 text의 좌표를 구한다.
    function getTextCoordinates(line){
        const radians = line.angle * Math.PI / 180;
        let x = 0;
        let y = 0;

        if(line.angle<90){
            x = cx + Math.sin(radians) * (r + 0.03*r);
            y = cy - Math.cos(radians) * (r + 0.05*r);
        }else if (line.angle<180){
            x = cx + Math.sin(radians) * (r + 0.04*r);
            y = cy - Math.cos(radians) * (r + 0.2*r);
        }else if (line.angle<270){
            x = cx + Math.sin(radians) * (r + 0.27*r);
            y = cy - Math.cos(radians) * (r + 0.2*r);
        }else{
            x = cx + Math.sin(radians) * (r + 0.25*r);
            y = cy - Math.cos(radians) * (r + 0.05*r);
        }

        if(line.angle===0) x = cx - 2;
        if(line.angle===90) y = cy + 2;
        if(line.angle===180) x = cx - 5;
        if(line.angle===270) y = cy + 2;
        return { x, y};
    }
</script>

<div >
    <svg viewBox="0 0 {vw} {vh}">
        <circle {cx} {cy} {r} stroke="#18181b" fill="white"  />

        {#each lines as line}
            <line
                    x1={getLineCoordinates(line).x1}
                    y1={getLineCoordinates(line).y1}
                    x2={getLineCoordinates(line).x2}
                    y2={getLineCoordinates(line).y2}
                    stroke="#18181b"
                    stroke-width="{line.stroke_width === 'thick' ? 1.5 : 0.5}"
            />
            <text
                    x={getTextCoordinates(line).x}
                    y={getTextCoordinates(line).y}
                    font-size="8"
                    fill="#18181b"
            >{line.text}</text>
        {/each}

    </svg>
</div>


