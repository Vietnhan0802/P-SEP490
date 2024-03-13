import React from "react";
import "../scss/MultiStepProgressBar.scss";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({page}) => {
    var stepPercentage = 0;
    if (page === 0) {
        stepPercentage = 0;
    } else if (page === 1) {
        stepPercentage = 50;
    } else if (page === 2) {
        stepPercentage = 100;
    } 

    return (
        <ProgressBar percent={stepPercentage}>
            <Step>
                {({ accomplished, index }) => (
                    <div className="d-flex flex-column justify-content-center">
                        <div
                            className={`indexedStep ${accomplished ? "accomplished" : null}`}
                        >
                            {index + 1}
                        </div>
                        <p style={{marginLeft:"-18px"}}>Preparing</p>
                    </div>

                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div className="d-flex flex-column">
                        <div
                            className={`indexedStep ${accomplished ? "accomplished" : null}`}
                        >
                            {index + 1}
                        </div>
                        <p style={{marginLeft:"-10px"}}>Process</p>
                    </div>

                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div className="d-flex flex-column">
                        <div
                            className={`indexedStep ${accomplished ? "accomplished" : null}`}
                        >
                            {index + 1}
                        </div>
                        <p style={{marginLeft:"-3px"}} >Done</p>
                    </div>
                )}
            </Step>
        </ProgressBar>
    );
};

export default MultiStepProgressBar;
