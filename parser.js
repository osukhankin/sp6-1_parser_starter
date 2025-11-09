const curObj = {
    '₽': 'RUB',
    '$': 'USD',
    '€': 'EUR',
}

function getMeta() {
    const lang = document
        .querySelector('html')
        .getAttribute('lang');

    const title = document
        .querySelector('title')
        .textContent
        .split('—')[0]
        .trim();

    const keywords = document
        .querySelector('meta[name="keywords"]')
        .getAttribute('content')
        .trim()
        .split(',')
        .map(keyword => keyword.trim());

    const description = document
        .querySelector('meta[name="description"]')
        .getAttribute('content')
        .trim();

    const opengraph = {};
    const ogTags = document.querySelectorAll('meta[property^="og:"]');
    ogTags.forEach(tag => {
        const property = tag.getAttribute('property');
        const key = property.replace('og:', '');
        let val = tag.getAttribute('content');
        if (val.includes('—')) {
            val = val.split('—')[0]
        }
        opengraph[key] = val.trim();
    });


    return {
        language: lang,
        title: title,
        keywords: keywords,
        description: description,
        opengraph: opengraph,
    }
}

function getProduct() {


    const id = document.querySelector('.product').getAttribute('data-id')
    const previewElem = document.querySelector('.preview')
    const aboutElem = document.querySelector('.about ')
    const allButElems = previewElem.querySelectorAll('nav button')
    const arrImg = []
    allButElems.forEach((but) => {
        arrImg.push(
            {
                preview: but.querySelector('img').getAttribute('src').trim(),
                full: but.querySelector('img').getAttribute('data-src').trim(),
                alt: but.querySelector('img').getAttribute('alt').trim(),

            }
        )
    })
    const productName = document.querySelector('h1').textContent.trim()
    const likeBut = previewElem.querySelector('figure button')
    const isLiked = likeBut.classList.contains('active')
    const tagsElems = aboutElem.querySelector('.tags')
    const tags = {
        category: tagsElems.querySelector('.green').textContent.split(',').map(t => t.trim()),
        discount: tagsElems.querySelector('.red').textContent.split(',').map(t => t.trim()),
        label: tagsElems.querySelector('.blue').textContent.split(',').map(t => t.trim()),
    }
    const priceElem = aboutElem.querySelector('.price');
    const priceText = priceElem.textContent.trim()

    const currencySymbol = priceText.match(/[^\d\s]/)?.[0] || '₽'

    const prices = priceText.split(currencySymbol).filter(p => p.trim())
    const price = Number(prices[0].trim())
    const oldPrice = Number(prices[1].trim())

    const discountPercent =  `${(100 * (1 - price / oldPrice)).toFixed(2) }%`
    const discount = oldPrice - price

    const propElements = aboutElem.querySelectorAll('.properties li')
    const properties = {}
    propElements.forEach((elem) => {
        const spanElems = elem.querySelectorAll('span')
        properties[spanElems[0].textContent.trim()] = spanElems[1].textContent.trim()
    })


    const descriptionElem = aboutElem.querySelector('.description');
    const clone = descriptionElem.cloneNode(true);
    clone.querySelectorAll('*').forEach(elem => {
        elem.removeAttribute('class');
    });
    const description = clone.innerHTML.trim();

    return {
        id: id,
        images: arrImg,
        name: productName,
        isLiked: isLiked,
        tags: tags,
        price: price,
        oldPrice: oldPrice,
        discount: discount,
        discountPercent: discountPercent,
        currency: curObj[currencySymbol],
        properties: properties,
        description: description,

    }
}

function getSuggested () {
    const articlesElems = document.querySelectorAll('.suggested .items article')
    const suggested = []
    articlesElems.forEach((elem) => {
        const suggestedItem = {}
        suggestedItem['image'] = elem.querySelector('img').getAttribute('src').trim()
        suggestedItem['name'] = elem.querySelector('h3').textContent.trim()
        suggestedItem['description'] = elem.querySelector('p').textContent.trim()
        const priceText = elem.querySelector('b').textContent.trim()
        const currencySymbol = priceText.match(/[^\d\s]/)?.[0] || '₽'
        suggestedItem['price'] = priceText.split(currencySymbol)[1]
        suggestedItem['currency'] = curObj[currencySymbol]
        suggested.push(suggestedItem)
    })

    return suggested
}

function getReviews () {
    const reviewsElems = document.querySelectorAll('.reviews .items article')
    const reviews = []
    reviewsElems.forEach((elem) => {
        const reviewItem = {}
        reviewItem['rating'] = elem.querySelectorAll('.filled').length
        reviewItem['author'] = {
            name: elem.querySelector('.author span').textContent.trim(),
            avatar: elem.querySelector('.author img').getAttribute('src').trim(),
        }
        reviewItem['title'] = elem.querySelector('h3').textContent.trim()
        reviewItem['date'] = elem.querySelector('.author i').textContent
            .trim()
            .replaceAll('/', '.')
        reviewItem['description'] = elem.querySelector('div p').textContent.trim()


        reviews.push(reviewItem)
    })
    return reviews
}

const meta = getMeta()
const product = getProduct()
const suggested = getSuggested()
const reviews = getReviews()


function parsePage() {
    return {
        meta: meta,
        product: product,
        suggested: suggested,
        reviews: reviews
    };
}

window.parsePage = parsePage;
