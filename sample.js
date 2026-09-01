// Just a mockup api call

const SAMPLE_DATA = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
}));

const fetchAPI = async (page = 1, limit = 10) => {
    const response = await fn(page, limit);

    console.log(`Fetched ${response.length} items from page ${page}`);
    console.log(response);
};

const fn = (page = 1, limit = 10) => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return SAMPLE_DATA.slice(start, end);
};

fetchAPI(3, 5);
