class APIFilters {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword
            ? {
                name: {
                    $regex: this.queryString.keyword,
                    $options: "i",
                },
            }
            : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    filters() {
        const queryCopy = { ...this.queryString };

        const fieldsToRemove = ["keyword","page"];
        fieldsToRemove.forEach((key) => delete queryCopy[key]);

        const mongoQuery = {};

        Object.keys(queryCopy).forEach((key) => {
            const match = key.match(/(\w+)\[(gte|gt|lte|lt)\]/);
            if (match) {
                const field = match[1];
                const operator = `$${match[2]}`;
                if (!mongoQuery[field]) {
                    mongoQuery[field] = {};
                }
                mongoQuery[field][operator] = Number(queryCopy[key]);
            } else {
                mongoQuery[key] = queryCopy[key];
            }
        });
        console.log(mongoQuery);
        this.query = this.query.find(mongoQuery);
        return this;
    }
    pagination(resPerPage){
        const currentPage =  Number(this.queryString.page)||1
        const skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

export default APIFilters;
