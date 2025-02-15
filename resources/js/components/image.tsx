import { CSSProperties, useState } from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
    alt?: string
    width?: number
    height?: number
    layout?: 'intrinsic' | 'fixed' | 'responsive'
    objectFit?: CSSProperties['objectFit']
    placeholder?: 'empty' | 'blur'
    blurDataURL?: string
    style?: CSSProperties
}

const Image: React.FC<ImageProps> = ({
    src,
    alt = '',
    width,
    height,
    layout = 'intrinsic', // Can be 'intrinsic', 'fixed', or            'responsive'
    objectFit = 'cover', // Similar to CSS `object-fit`
    placeholder = 'empty', // Can be 'empty' or 'blur'
    blurDataURL,
    style = {},
    ...rest
}) => {
    const [loaded, setLoaded] = useState(false)

    const onLoadHandler = () => {
        setLoaded(true)
    }

    const getWrapperStyles = (): CSSProperties => {
        switch (layout) {
            case 'intrinsic':
                return {
                    position: 'relative',
                    width: `${width}px`,
                    height: `${height}px`,
                }
            case 'fixed':
                return {
                    width: `${width}px`,
                    height: `${height}px`,
                }
            case 'responsive':
                return {
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingTop:
                        width && height
                            ? `${(height / width) * 100}%`
                            : undefined,
                }
            default:
                return {}
        }
    }

    const getImageStyles = (): CSSProperties => ({
        objectFit,
        display: loaded ? 'block' : 'none',
        width: layout === 'responsive' ? '100%' : width,
        height: layout === 'responsive' ? '100%' : height,
        ...style,
    })

    const getPlaceholderStyles = (): CSSProperties => ({
        display: loaded ? 'none' : 'block',
        width: '100%',
        height: '100%',
        background:
            placeholder === 'blur' && blurDataURL
                ? `url(${blurDataURL}) center/cover no-repeat`
                : '#f0f0f0',
    })

    return (
        <div style={getWrapperStyles()}>
            {placeholder && <div style={getPlaceholderStyles()} />}
            <img
                src={src}
                alt={alt}
                onLoad={onLoadHandler}
                style={getImageStyles()}
                {...rest}
            />
        </div>
    )
}

export default Image
