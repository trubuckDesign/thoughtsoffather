import React, { useState, useEffect } from "react";
import Measure from "react-measure";

interface MeasuredContentProps {
  htmlContent: string;
  onMeasure: (height: number) => void;
}

export const MeasuredContent: React.FC<MeasuredContentProps> = ({ htmlContent, onMeasure }) => {
  return (
    <Measure bounds onResize={(contentRect) => onMeasure(contentRect.bounds?.height || 100)}>
      {({ measureRef }) => <div ref={measureRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />}
    </Measure>
  );
};
