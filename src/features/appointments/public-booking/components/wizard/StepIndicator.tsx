"use client";

import React from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

interface Step {
    number: number;
    title: string;
}

interface StepIndicatorProps {
    currentStep: number;
    steps: Step[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isCurrent = currentStep === step.number;
                    const isLast = index === steps.length - 1;

                    return (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                                        w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold
                                        transition-all duration-300
                                        ${
                                            isCompleted
                                                ? "bg-green-500 text-white"
                                                : isCurrent
                                                ? "bg-[var(--ant-primary-color)] text-white ring-4 ring-blue-50"
                                                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                                        }
                                    `}
                                >
                                    {isCompleted ? <CheckCircleOutlined /> : step.number}
                                </div>
                                <span
                                    className={`
                                        mt-2 text-xs sm:text-sm font-medium text-center
                                        ${isCurrent ? "text-gray-900" : "text-gray-500"}
                                    `}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {!isLast && (
                                <div
                                    className={`
                                        flex-1 h-1 mx-2 sm:mx-4 rounded transition-all duration-300
                                        ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                                    `}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
