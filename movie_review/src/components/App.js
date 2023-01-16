import ReviewList from "./ReviewList";
import { useEffect, useState } from "react";
import { getReviews } from "../aip";
import ReviewForm from "./ReviewForm";

const LIMIT = 6;

function App() {
    //최신순, 베스트순
    const [order, setOrder] = useState("createdAt");
    //삭제 함수(선택 된 거 빼고 items로 바꿔줌.)
    const [items, setItems] = useState([]);
    const sortedItems = items.sort((a, b) => b[order] - a[order]);

    const [offset, setOffset] = useState(0);
    const [hasNext, setHasNext] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(null);

    const handleNewestClick = () => setOrder("createdAt");
    const handleBestClick = () => setOrder("rating");

    const handleLoadMore = () => {
        handleLoad({ order, offset, limit: LIMIT });
    };
    const handleDelete = (id) => {
        const nextItems = items.filter((item) => item.id !== id);
        setItems(nextItems);
    };

    //리뷰 데이터 불러오고 세팅
    const handleLoad = async (options) => {
        let result;
        try {
            setIsLoading(true);
            setLoadingError(null);
            result = await getReviews(options);
        } catch (error) {
            setLoadingError(error);
            return;
        } finally {
            setIsLoading(false);
        }
        const { reviews, paging } = result;

        if (options.offset === 0) {
            setItems(reviews);
        } else {
            setItems((prevItems) => [...prevItems, ...reviews]);
        }
        setOffset(options.offset + reviews.length);
        setHasNext(paging.hasNext);
    };
    //이렇게 되면 handleLoad가 실행되면 setItems가 실행되고, setItems가 실해오되면, App이 재실행 되기 된다.
    //App이 재실행되면, handleload가 다시 실행되고 무한 반복이 된다.
    //useEffect안에 handleload를 넣어주자.
    useEffect(() => {
        handleLoad({ order, offset: 0, limit: LIMIT });
    }, [order]);

    return (
        <div>
            <div>
                <button onClick={handleNewestClick}>최신순</button>
                <button onClick={handleBestClick}>베스트순</button>
            </div>
            <ReviewForm />
            <ReviewList items={sortedItems} onDelete={handleDelete} />
            {hasNext && (
                <button disabled={isLoading} onClick={handleLoadMore}>
                    더보기
                </button>
            )}
            {loadingError?.mesage && <span>{loadingError.mesage}</span>}
        </div>
    );
}

export default App;
