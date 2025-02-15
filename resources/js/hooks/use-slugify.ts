const useSlugify = () => {
    const slugify = (str: string) => {
        return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return { slugify };
}

export default useSlugify;
