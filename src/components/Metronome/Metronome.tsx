import { useContext, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { default as LibMetronome } from '../../utils/Metronome/metronome'
import { ControlCenter } from '../ControlCenter'
import { KVContext } from '../KVContextProvider/KVContextProvider'
import { MetroContext } from '../MetroContextProvider/MetroContextProvider'
import { Ticker } from '../Ticker'

const TickerWrapper = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  transform: translate(0, 20vh);
`

const markBounce = keyframes`
0% {
  opacity: 1;
}

3% {
  opacity: 0;
}

97% {
  opacity: 0;
}

100% {
  opacity: 1;
}
`

const MiddleMark = styled.div<{
  playing: boolean
  bps: number
  hidden?: boolean
}>`
  ${({ playing, bps }) =>
    playing &&
    css`
      animation: ${markBounce} ${bps}s linear infinite;
    `}

  ${({ hidden }) =>
    hidden &&
    css`
      display: none;
    `}

  position: absolute;
  border-radius: 50%;
  background-color: white;
  width: 1.5vh;
  height: 1.5vh;
  top: 12vh;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`

const Metronome = () => {
  const [hasStarted, setHasStarted] = useState(false)
  const {
    bpm,
    setBpm,
    isPlaying = false,
    setIsPlaying,
    tapper,
  } = useContext(MetroContext)
  const { blinkOnTick, muteSound, showMetronome } = useContext(KVContext)

  useEffect(() => {
    setHasStarted?.(isPlaying)
  }, [isPlaying])

  return (
    <LibMetronome
      key={`${bpm}-${isPlaying}-${blinkOnTick}`}
      tempo={bpm}
      autoplay={isPlaying}
      beatVolume={muteSound ? 0 : 1}
      render={({
        playing,
        onPlay,
        onTempoChange,
      }: {
        tempo: number
        beatsPerMeasure: number
        playing: boolean
        beat: number
        onPlay: () => void
        onTempoChange: (tempo: number) => void
      }) => {
        return (
          <>
            {showMetronome && (
              <MiddleMark
                playing={playing}
                bps={60 / (bpm || 0)}
                hidden={!blinkOnTick}
              />
            )}
            {showMetronome && (
              <TickerWrapper>
                <Ticker isPlaying={playing} />
              </TickerWrapper>
            )}
            <ControlCenter
              onTempoChange={(tempo: number) => {
                onTempoChange(tempo)
                setBpm?.(tempo)
              }}
              onPlay={() => {
                if (!hasStarted) {
                  setHasStarted(true)
                }
                setIsPlaying?.(!isPlaying)
                onPlay()
              }}
              isPlaying={playing}
              handleTapTempo={() => {
                tapper?.tap()
                onTempoChange(tapper?.bpm)
                setBpm?.(tapper?.bpm)
              }}
            />
          </>
        )
      }}
    />
  )
}

export default Metronome
