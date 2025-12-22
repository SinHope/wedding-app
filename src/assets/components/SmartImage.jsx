import { useState } from "react";

const SmartImage = ({ src, alt }) => {
    const [isPortrait, setIsPortrait] = useState(false);

    return (
        <img
            src={src}
            alt={alt}
            onLoad={(e) => {
                const img = e.target;
                setIsPortrait(img.naturalHeight > img.naturalWidth);
            }}
            style={{
                width: "100%",
                height: '400px',
                objectFit: isPortrait? "cover": "contain",
                backgroundColor: "#ffffffff"
            }}
        />
    );
};

export default SmartImage;
