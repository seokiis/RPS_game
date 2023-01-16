//파일 인풋은 반드시 비제어 인풋으로 만들어야한다.

import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

function FileInput({ name, value, onChange }) {
    const [preview, setPreview] = useState();
    const inputRef = useRef();

    const handleChange = (e) => {
        const nextValue = e.target.files[0];
        onChange(name, nextValue);
    };

    //처음 렌더링 됐을 때만 inputRef를 콘솔로 보여줌.
    // useEffect(() => {
    //     if (inputRef.current) {
    //         console.log(useRef);
    //     }
    // }, []);

    //파일 인풋 초기화
    const handleClearClick = () => {
        const inputNode = inputRef.current;
        if (!inputNode) return;
        inputNode.value = "";
        onChange(name, null);
    };

    useEffect(() => {
        if (!value) return;
        //사이드이펙트
        const nextPreview = URL.createObjectURL(value);
        setPreview(nextPreview);

        //사이드이펙트 정리하기
        return () => {
            setPreview();
            URL.revokeObjectURL(nextPreview);
        };
    }, [value]);

    //value 의 값이 있을 때만 초기화 버튼
    return (
        <div>
            <img src={preview} alt="이미지 미리보기"></img>
            <input
                type="file"
                accpet="image/png,image/jpeg"
                onChange={handleChange}
                ref={inputRef}
            />
            {value && <button onClick={handleClearClick}>X</button>}
        </div>
    );
}

export default FileInput;
