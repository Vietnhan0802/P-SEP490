import React from "react";
import "../scss/MultiStepProgressBar.scss";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({ page, onPageNumberClick }) => {
    var stepPercentage = 0;
    if (page === "pageone") {
        stepPercentage = 16;
    } else if (page === "pagetwo") {
        stepPercentage = 49.5;
    } else if (page === "pagethree") {
        stepPercentage = 82.5;
    } else if (page === "pagefour") {
        stepPercentage = 100;
    } else {
        stepPercentage = 0;
    }

    return (
        <ProgressBar percent={stepPercentage}>
            <Step>
                {({ accomplished, index }) => (
                    <div className="d-flex flex-column justify-content-center">
                        <div
                            className={`indexedStep ${accomplished ? "accomplished" : null}`}
                            onClick={() => onPageNumberClick("1")}
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
                            onClick={() => onPageNumberClick("2")}
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
                            onClick={() => onPageNumberClick("3")}
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
