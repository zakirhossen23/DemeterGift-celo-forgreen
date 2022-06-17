import React from "react";
//These are Third party packages for smooth slideshow
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slideshow = (images = []) => {


	//These are custom properties for zoom effect while slide-show
	const zoomInProperties = {
		indicators: true,
		scale: 1.2,
		duration: 5000,
		transitionDuration: 500,
		infinite: true,
		prevArrow: (
			<div style={{ width: "30px", marginRight: "-30px", cursor: "pointer" }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					fill="#2e2e2e"
				>
					<path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
				</svg>
			</div>
		),
		nextArrow: (
			<div style={{ width: "30px", marginLeft: "-30px", cursor: "pointer" }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					fill="#2e2e2e"
				>
					<path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
				</svg>
			</div>
		),
	};

	if (images['images'].length !== 0 & images !== undefined) {

		return (
			<div className="m-10">
				<Zoom {...zoomInProperties}>
					{images['images'].map((each, index) => (
						<div key={index} style={{
							display: "flex",
							justifyContent: "center",
							width: "70%",
							height: "100%"
						}}>
							<iframe
								width="100%"
								height={315}
								src={each}
								frameBorder={0}
								style={{
									objectFit: "cover",
									width: "75%",
									borderRadius: "0.5rem",
									boxShadow:
										"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
								}}
					></iframe>
						</div>
					))}
				</Zoom>
			</div>
		);
	}
	return <></>

};

export default Slideshow;
