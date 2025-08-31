import { AnnotationHandler, InnerLine } from "codehike/code"

export const hover: AnnotationHandler = {
  name: "hover",
  onlyIfAnnotated: true,
  Line: ({ annotation, ...props }) => (
    <InnerLine
      merge={props}
      className="translation-opacity"
      data-line={annotation?.query || ""}
    />
  ),
}
