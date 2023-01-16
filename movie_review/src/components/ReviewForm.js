import { useState } from "react";
import FileInput from "./FileInput";
import "./ReviewForm.css";
import RatingInput from "./RatingInput";
import { createReview } from "../api";

const INITIAL_VALUES = {
    title: "",
    rating: 0,
    content: "",
    imgFile: null,
};

function ReviewForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingError, setSubmittingError] = useState(null);
    const [values, setValues] = useState(INITIAL_VALUES);

    const handleChange = (name, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("rating", values.rating);
        formData.append("content", values.content);
        formData.append("imgFile", values.imgFile);
        await createReview(formData);
        setValues(INITIAL_VALUES);
        try {
            setSubmittingError(null);
            setIsSubmitting(true);
            await createReview(formData);
        } catch (error) {
            setSubmittingError(error);
            return;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="ReviewForm" onSubmit={handleSubmit}>
            <FileInput
                name="imgFile"
                value={values.imgFile}
                onChange={handleChange}
            />
            <input
                name="title"
                value={values.title}
                onChange={handleInputChange}
            ></input>
            <RatingInput
                name="rating"
                type="number"
                value={values.rating}
                onChange={handleChange}
            ></RatingInput>
            <textarea
                name="content"
                value={values.content}
                onChange={handleInputChange}
            ></textarea>
            <button type="submit" disabled={isSubmitting}>
                확인
            </button>
            {submittingError?.message && <div>{submittingError.message}</div>}
        </form>
    );
}

export default ReviewForm;
