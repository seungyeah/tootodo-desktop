<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        class="w-[24px] h-[24px]"
>
    <!-- 토마토 그림자 -->
    <ellipse cx="400" cy="700" rx="350" ry="100" fill="rgba(0,0,0,0.1)" />
    <!-- 그림자 효과 필터 -->
    <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
            <feOffset dx="10" dy="10" result="offsetblur" />
            <feFlood flood-color="rgba(0,0,0,0.5)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>

    <!-- 토마토 본체 -->
    <circle cx="400" cy="400" r="350" fill="#D92B3A" filter="url(#shadow)" />

    <!-- 토마토 꼭지의 첫 번째 부분 -->
    <polygon points="400,100 460,360 200,240 600,240 340,360" fill="rgb(5,150,105)" filter="url(#shadow)" />

</svg>