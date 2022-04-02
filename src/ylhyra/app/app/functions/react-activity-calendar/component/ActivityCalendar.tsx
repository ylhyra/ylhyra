/* eslint-disable @typescript-eslint/no-unused-vars */
import { minutes, prettyPrintDaysMinutesHours } from "modules/time";
import type { Day as WeekDay } from "date-fns";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import getYear from "date-fns/getYear";
import parseISO from "date-fns/parseISO";
import React, { CSSProperties, FunctionComponent, ReactNode } from "react";
import color from "tinycolor2";
import {
  Day,
  Labels,
  Theme,
} from "ylhyra/app/app/functions/react-activity-calendar/types";
import {
  DEFAULT_LABELS,
  DEFAULT_WEEKDAY_LABELS,
  generateEmptyData,
  getClassName,
  getMonthLabels,
  getTheme,
  groupByWeeks,
  MIN_DISTANCE_MONTH_LABELS,
  NAMESPACE,
} from "ylhyra/app/app/functions/react-activity-calendar/util";
import "ylhyra/app/app/functions/react-activity-calendar/component/styles.css";

const textColor = "#464646";
const baseColor = color("#2d81ff");
const emptyColor = color("white").darken(4).toHslString();
const marginLeft = 29;

type CalendarData = Array<Day>;

export interface Props {
  /**
   * List of calendar entries. Every `Day` object requires an ISO 8601 `date`
   * property in the format `yyyy-MM-dd`, a `count` property with the amount
   * of tracked data and finally a `userLevel` property in the range `0 - 4` to
   * specify activity intensity.
   *
   * Example object:
   *
   * ```json
   * {
   *   date: "2021-02-20",
   *   count: 16,
   *   userLevel: 3
   * }
   * ```
   */
  data: CalendarData;
  /**
   * Margin between blocks in pixels.
   */
  blockMargin?: number;
  /**
   * Border radius of blocks in pixels.
   */
  blockRadius?: number;
  /**
   * Block size in pixels.
   */
  blockSize?: number;
  /**
   * Pass `<ReactTooltip html />` as child to show tooltips.
   */
  children?: ReactNode;
  /**
   * Base color to compute graph intensity hues (darkest color). Any valid CSS color is accepted
   */
  color?: string;
  /**
   * A date-fns/format compatible date string used in tooltips.
   */
  dateFormat?: string;
  /**
   * Font size for text in pixels.
   */
  fontSize?: number;
  /**
   * Toggle to hide color legend below calendar.
   */
  hideColorLegend?: boolean;
  /**
   * Toggle to hide month labels above calendar.
   */
  hideMonthLabels?: boolean;
  /**
   * Toggle to hide total count below calendar.
   */
  hideTotalCount?: boolean;
  /**
   * Localization strings for all calendar labels. `totalCount` supports the placeholders `{{count}}` and `{{year}}`:
   */
  labels?: Labels;
  /**
   * Toggle for loading state. `data` property will be ignored if set.
   */
  loading?: boolean;
  /**
   * Toggle to show weekday labels left to the calendar.
   */
  showWeekdayLabels?: boolean;
  /**
   * Style object to pass to component container.
   */
  style?: CSSProperties;
  /**
   * An object specifying all theme colors explicitly`.
   */
  theme?: Theme;
  /**
   * Index of day to be used as start of week. 0 represents Sunday.
   */
  weekStart?: WeekDay;
}

const ActivityCalendar: FunctionComponent<Props> = ({
  data,
  blockMargin = 4,
  blockRadius = 2,
  blockSize = 12,
  children,
  color = undefined,
  dateFormat = "d MMMM yyyy",
  fontSize = 14,
  hideColorLegend = false,
  hideMonthLabels = false,
  hideTotalCount = false,
  labels: labelsProp,
  loading = false,
  showWeekdayLabels = false,
  style = {},
  theme: themeProp,
  weekStart = 0, // Sunday
}: Props) => {
  if (loading) {
    data = generateEmptyData();
  }

  if (data.length === 0) {
    return null;
  }

  const weeks = groupByWeeks(data, weekStart);
  const totalCount = data.reduce((sum, day) => sum + day.count, 0);
  const year = getYear(parseISO(data[0]?.date));

  const theme = getTheme(themeProp, color);
  const labels = Object.assign({}, DEFAULT_LABELS, labelsProp);
  const textHeight = hideMonthLabels ? 0 : fontSize + 1;

  function getDimensions() {
    return {
      width: weeks.length * (blockSize + blockMargin) - blockMargin,
      height: textHeight + (blockSize + blockMargin) * 7 - blockMargin,
    };
  }

  function getTooltipMessage(contribution: Day) {
    const date = format(parseISO(contribution.date), dateFormat);
    if (!contribution.count) {
      return `${date}: Not played`;
    }
    return `${date}: ${prettyPrintDaysMinutesHours(
      contribution.count * minutes
    )}`;
  }

  function renderLabels() {
    const style = {
      fontSize,
    };

    if (!showWeekdayLabels && hideMonthLabels) {
      return null;
    }

    return (
      <>
        {showWeekdayLabels && (
          <g className={getClassName("legend-weekday")} style={style}>
            {weeks[1].map((day, y) => {
              if (!day || y % 2 === 0) {
                return null;
              }

              const dayIndex = getDay(parseISO(day.date));

              return (
                <text
                  x={marginLeft - 4}
                  y={
                    textHeight +
                    (fontSize / 2 + blockMargin) +
                    (blockSize + blockMargin) * y +
                    2
                  }
                  textAnchor="end"
                  key={day.date}
                  style={{ color: textColor }}
                >
                  {labels.weekdays
                    ? labels.weekdays[dayIndex]
                    : DEFAULT_WEEKDAY_LABELS[dayIndex]}
                </text>
              );
            })}
          </g>
        )}
        {!hideMonthLabels && (
          <g className={getClassName("legend-month")} style={style}>
            {getMonthLabels(weeks, labels.months).map(
              ({ text, x }, index, labels) => {
                // Skip the first month label if there's not enough space to the next one
                if (
                  index === 0 &&
                  labels[1] &&
                  labels[1].x - x <= MIN_DISTANCE_MONTH_LABELS
                ) {
                  return null;
                }

                return (
                  <text
                    x={(blockSize + blockMargin) * x + marginLeft}
                    alignmentBaseline="hanging"
                    key={x}
                    style={{ color: textColor }}
                  >
                    {text}
                  </text>
                );
              }
            )}
          </g>
        )}
      </>
    );
  }

  function renderBlocks() {
    return weeks
      .map((week, weekIndex) =>
        week.map((day, dayIndex) => {
          if (!day) {
            return null;
          }

          const style = undefined;

          // const style = day.date.endsWith("01")
          //   ? {
          //       stroke: `rgba(0, 0, 0, 0.15)`,
          //     }
          //   : undefined;

          const y = textHeight + (blockSize + blockMargin) * dayIndex;
          return (
            <rect
              x={0}
              y={y}
              width={blockSize}
              height={blockSize}
              fill={
                day.level
                  ? baseColor.setAlpha(day.level).toHslString()
                  : emptyColor
              }
              rx={blockRadius}
              ry={blockRadius}
              className={"block"}
              data-date={day.date}
              data-tip={children ? getTooltipMessage(day) : undefined}
              key={day.date}
              style={style}
            >
              <title>{getTooltipMessage(day)}</title>
            </rect>
          );
        })
      )
      .map((week, x) => (
        <g
          key={x}
          transform={`translate(${
            (blockSize + blockMargin) * x + marginLeft
          }, 0)`}
        >
          {week}
        </g>
      ));
  }

  function renderFooter() {
    return null;
  }

  const { width, height } = getDimensions();
  const additionalStyles = {
    width,
    maxWidth: "100%",
  };

  return (
    <article className={NAMESPACE} style={{ ...style, ...additionalStyles }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={"calendar"}
      >
        {!loading && renderLabels()}
        {renderBlocks()}
      </svg>
      {renderFooter()}
      {children}
    </article>
  );
};

export const Skeleton: FunctionComponent<Omit<Props, "data">> = (props) => (
  <ActivityCalendar data={[]} {...props} />
);

export default ActivityCalendar;
