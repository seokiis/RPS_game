const BASE_URL = "https://learn.codeit.kr/4295";

export async function getReviews({
    order = "createdAt",
    offset = 0,
    limit = 6,
}) {
    const query = `order=${order}&offset=${offset}&limit=${limit}`;
    const response = await fetch(`${BASE_URL}/film-reviews?${query}`);
    if (!response.ok) {
        throw new Error("리뷰를 불러오는 데에 실패했습니다.");
    }
    const body = await response.json();
    return body;
}

export async function createReview(formData) {
    const response = await fetch(`${BASE_URL}/film-reviews`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("리뷰를 불러오는 데에 실패했습니다.");
    }
    const body = await response.json();
    return body;
}
