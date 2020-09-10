export const linksChartContents = [
    {
        label: 'Broken Internal Links',
        filter: 'status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR&type=PAGE',
        color: '#f56565'
    }, {
        label: 'Broken External Links',
        filter: 'status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR&type=EXTERNAL',
        color: '#e53e3e'
    }, {
        label: 'No Issues',
        filter: '',
        color: '#48bb78'
    }
]

export const seoChartContents = [
    {
        label: 'Missing Title',
        filter: 'has_title=false',
        color: '#f56565'
    }, {
        label: 'Missing Description',
        filter: 'has_title=false',
        color: '#e53e3e'
    }, {
        label: 'Missing H1',
        filter: 'has_h1_first=false',
        color: '#c53030'
    }, {
        label: 'Missing H2',
        filter: 'has_h2_first=false',
        color: '#9b2c2c'
    }, {
        label: 'No Issues',
        filter: '',
        color: '#48bb78'
    },
]

export const pagesChartContents = [
    {
        label: 'Large Page Size',
        filter: '',
        color: '#f56565'
    }, {
        label: 'Broken Security',
        filter: '',
        color: '#e53e3e'
    }, {
        label: 'No Issues',
        filter: '',
        color: '#48bb78'
    }
]

export const imagesChartContents = [
    {
        label: 'Broken Images',
        filter: 'status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR',
        color: '#f56565'
    }, {
        label: 'Broken Security',
        filter: '',
        color: '#e53e3e'
    }, {
        label: 'No Issues',
        filter: '',
        color: '#48bb78'
    }
]