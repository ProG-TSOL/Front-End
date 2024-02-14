import React from 'react';

interface Props {
  src: string;
  alt: string;
  type: 'project' | 'member';
}

const ImageWithFallback: React.FC<Props> = ({ src, alt, type }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const projectImg:string = 'https://media.istockphoto.com/id/1413922045/ko/%EB%B2%A1%ED%84%B0/%EC%A7%91%EC%97%90%EC%84%9C-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D.jpg?s=612x612&w=0&k=20&c=YO7NLmXxEcLSveuzQvhh9Pe8ex4VBp8I6CqggxaQNJ4=';
  const memberImg:string ='';
  const defaultImages = {
    'project': projectImg,
    'member': memberImg,
  };

  const onError = () => {
    if (!src.trim()) {
      setImgSrc(defaultImages[type]);
    }
  };

  return <img src={imgSrc} alt={alt} onError={onError} />;
};
export default ImageWithFallback;
