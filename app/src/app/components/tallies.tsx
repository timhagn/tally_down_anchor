'use client'

import { Property } from 'csstype'
import { Fragment } from 'react'

function Tallies({
  number = 0,
  textColor,
  textSize,
  font,
  lineDecoration = 'line-through',
  lineStyle,
  lineColor,
  className,
}: {
  number: number
  textColor?: any
  textSize?: any
  font?: any
  lineDecoration?: Property.TextDecorationLine
  lineStyle?: Property.TextDecorationStyle
  lineColor?: Property.TextDecorationColor
  className?: string
}) {
  let fives = new Array(Math.floor(number / 5)).fill('')
  let ones = new Array(Math.floor(number % 5)).fill('|').join('')

  return (
    <>
      <div
        style={{ color: textColor, fontSize: textSize, fontFamily: font }}
        className={className}
      >
        {fives.map((_, index) => (
          <Fragment key={`tally-fives-${index}`}>
            <span
              style={{
                textDecorationLine: lineDecoration,
                textDecorationStyle: lineStyle,
                textDecorationColor: lineColor,
              }}
            >
              ||||
            </span>{' '}
          </Fragment>
        ))}
        <span>{ones}</span>
      </div>
    </>
  )
}

export default Tallies
