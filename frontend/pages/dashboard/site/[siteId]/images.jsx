import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR, { mutate } from 'swr'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useUser from 'hooks/useUser'
import ImageTableContent from 'public/data/image-table.json'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import LinkOptions from 'components/site/LinkOptions'
import ImageFilter from 'components/site/ImageFilter'
import ImageTable from 'components/site/ImageTable'
import ImageSorting from 'components/site/ImageSorting'
import Pagination from 'components/sites/Pagination'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const initialOrder = {
  imageUrl: "default",
  createdAt: "default",
  status: "default",
  httpCode: "default",
  occurrences: "default",
}

const ImagesDiv = styled.section``

const Images = props => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [pagePath, setPagePath] = useState("")
  const [sortOrder, setSortOrder] = useState(initialOrder)
  const [allFilter, setAllFilter] = useState(false)
  const [imageWorkingFilter, setImageWorkingFilter] = useState(false)
  const [imageNotWorkingFilter, setImageNotWorkingFilter] = useState(false)

  const [searchKey, setSearchKey] = useState("")

  const pageTitle = "Images |"

  const { user: user, userError: userError } = useUser({
    redirectTo: "/login",
    redirectIfFound: false,
  })

  const { query, asPath } = useRouter()
  const { data: site, error: siteError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/` : null),
    fetcher
  )

  const { data: scan, error: scanError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/scan/` : null),
    fetcher
  )

  let scanObjId = ""

  if (scan) {
    let scanObj = []

    scan.results.map((val) => {
      scanObj.push(val)
      return scanObj
    })

    scanObj.map((val) => {
      scanObjId = val.id
      return scanObjId
    })
  }

  let scanApiEndpoint = props.result.page !== undefined ? `/api/site/${query.siteId}/scan/${scanObjId}/image/?page=` + props.result.page : `/api/site/${query.siteId}/scan/${scanObjId}/image/`
  const statusString = Array.isArray(props.result.status) ? props.result.status.join('&status=') : props.result.status
  let queryString = props.result.status !== undefined && props.result.status.length != 0 ? ( (scanApiEndpoint).includes('?') ? '&status=' + statusString : '?status=' + statusString ) : ''
  const typeString = Array.isArray(props.result.type) ? props.result.type.join('&type=') : props.result.type
	queryString += props.result.type !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&type=${typeString}` : `?type=${typeString}` ) : ''
	
	queryString += props.result.search !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&search=${props.result.search}` : `?search=${props.result.search}` ) : ''
	queryString += props.result.ordering !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&ordering=${props.result.ordering}` : `?ordering=${props.result.ordering}` ) : ''
  
	scanApiEndpoint += queryString

  const { data: image, error: imageError, mutate: updateLinks } = useSWR(
    () => (query.siteId && scanObjId ? scanApiEndpoint : null),
    fetcher,
    {
      refreshInterval: 50000,
    }
  )

  const removeURLParameter = (url, parameter) => {
    //prefer to use l.search if you have a location/link object
    const urlparts = url.split("?")
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + "="
      const pars = urlparts[1].split(/[&]/g)

      //reverse iteration as may be destructive
      for (var i = pars.length; i--> 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1)
        }
      }

      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "")
    }

    return url
  }

  const searchEventHandler = async (e) => {
    if (e.keyCode != 13) return false

    let newPath = removeURLParameter(asPath, "search")
    newPath = removeURLParameter(newPath, "page")

    if (e.target.value == "" || e.target.value == " ") {
      setSearchKey(e.target.value)
      if (newPath.includes("?")) setPagePath(`${newPath}&`)
      else setPagePath(`${newPath}?`)

      Router.push("/dashboard/site/[siteId]/images", newPath)
      return
    }

    if (newPath.includes("?")) newPath += `&search=${e.target.value}`
    else newPath += `?search=${e.target.value}`

    setSearchKey(e.target.value)
    if (newPath.includes("?")) setPagePath(`${newPath}&`)
    else setPagePath(`${newPath}?`)

    Router.push("/dashboard/site/[siteId]/images", newPath)
    updateLinks()
  }

  const slugToCamelcase = (slug) => {
    return slug.replace(/(\-\w)/g, function (m) {
      return m[1].toUpperCase()
    })
  }

  const getSortKeyFromSlug = (slug) => {
    let sortKey = ""

    ImageTableContent.forEach((val, index) => {
      if (val.slug == slug) sortKey = val.key
    })

    return sortKey
  }

  const getSlugFromSortKey = (sortKey) => {
    let slug = ""

    ImageTableContent.forEach((val, index) => {
      if (val.key == sortKey) slug = val.slug
    })

    return slug
  }

  const SortHandler = slug => {
    setSortOrder({ ...initialOrder })

    let newPath = removeURLParameter(asPath, "ordering")

    const sortItem = slugToCamelcase(slug)
    const sortKey = getSortKeyFromSlug(slug)

    if (sortOrder[sortItem] == "default") {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }))
      if (newPath.includes("?")) newPath += `&ordering=${sortKey}`
      else newPath += `?ordering=${sortKey}`
    } else if (sortOrder[sortItem] == "asc") {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: "desc" }))
      if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`
      else newPath += `?ordering=-${sortKey}`
    } else {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }))
      if (newPath.includes("?")) newPath += `&ordering=${sortKey}`
      else newPath += `?ordering=${sortKey}`
    }

    if (newPath.includes("?"))
      setPagePath(`${removeURLParameter(newPath, "page")}&`)
    else setPagePath(`${removeURLParameter(newPath, "page")}?`)

    Router.push("/dashboard/site/[siteId]/images", newPath)
    updateLinks()
  }

  // FIXME: filterChangeHandler()
  const filterChangeHandler = async (e) => {
    const filterType = e.target.value
    const filterStatus = e.target.checked

    let newPath = asPath

    if (filterType == "working" && filterStatus == true) {
      setImageWorkingFilter(true)
      setImageNotWorkingFilter(false)
      setAllFilter(false)
      newPath = removeURLParameter(newPath, "page")
      newPath = removeURLParameter(newPath, "status")

      if (newPath.includes("?"))
        newPath += `&status=OK`
      else newPath += `?status=OK`
    } else if (filterType == "working" && filterStatus == false) {
      newPath = removeURLParameter(newPath, "status")
      setImageWorkingFilter(false)
    }
    
    if (filterType == "notWorking" && filterStatus == true) {
      setImageNotWorkingFilter(true)
      setImageWorkingFilter(false)
      setAllFilter(false)
      newPath = removeURLParameter(newPath, "page")
      newPath = removeURLParameter(newPath, "status")

      if (newPath.includes("?"))
        newPath += `&status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`
      else newPath += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`
    } else if (filterType == "notWorking" && filterStatus == false) {
      newPath = removeURLParameter(newPath, "status")
      setImageNotWorkingFilter(false)
    }

    if (filterType == "all" && filterStatus == true) {
      setAllFilter(true)
      setImageWorkingFilter(false)
      setImageNotWorkingFilter(false)

      newPath = removeURLParameter(newPath, "status")
      newPath = removeURLParameter(newPath, "page")

      if (!newPath.includes("search") && !newPath.includes("ordering"))
        newPath = newPath.replace("?", "")
    }

    if (newPath.includes("?")) setPagePath(`${newPath}&`)
    else setPagePath(`${newPath}?`)

    Router.push("/dashboard/site/[siteId]/images", newPath)

    updateLinks()

    return true
  }

  useEffect(() => {
    if(removeURLParameter(asPath, 'page').includes("?"))
      setPagePath(`${removeURLParameter(asPath, 'page')}&`)
    else
      setPagePath(`${removeURLParameter(asPath, 'page')}?`)

    if(props.result.search !== undefined)
      setSearchKey(props.result.search)

    if(props.result.ordering !== undefined) {
      const slug = getSlugFromSortKey(props.result.ordering.replace('-', ''))
      const orderItem = slugToCamelcase(slug)

      if(props.result.ordering.includes('-'))
        setSortOrder(prevState => ({ ...prevState, [orderItem]: 'desc' }));
      else
        setSortOrder(prevState => ({ ...prevState, [orderItem]: 'asc' }));
    }
    
  }, [])

  // TODO: useEffect[filterChangeHandler]
  useEffect(() => {
    if(props.result.status !== undefined && Array.isArray(props.result.status)) {
      setImageWorkingFilter(false)
      setImageNotWorkingFilter(true)
      setAllFilter(false)
    }
    else if(props.result.status !== undefined && !Array.isArray(props.result.status)) {
      setImageWorkingFilter(true)
      setImageNotWorkingFilter(false)
      setAllFilter(false)
    }

    if(props.result.type == undefined && props.result.status == undefined) {
      setImageWorkingFilter(false)
      setImageNotWorkingFilter(false)
      setAllFilter(true)
    }
  }, [filterChangeHandler])

  {userError && <Layout>{userError.message}</Layout>}
  {imageError && <Layout>{imageError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}
  {siteError && <Layout>{siteError.message}</Layout>}

  return (
    <Layout>
      {user && image && site ? (
        <Fragment>
          <Head>
            <title>
              {pageTitle} {site.name}
            </title>
          </Head>

          <ImagesDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
            <MobileSidebar show={openMobileSidebar} />
            <MainSidebar />

            <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
              <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
                <button
                  className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
                  aria-label={`Open sidebar`}
                  onClick={() =>
                    setTimeout(
                      () => setOpenMobileSidebar(!openMobileSidebar),
                      150
                    )
                  }
                >
                  <svg
                    className={`h-6 w-5`}
                    stroke={`currentColor`}
                    fill={`none`}
                    viewBox={`0 0 24 24`}
                  >
                    <path
                      strokeLinecap={`round`}
                      strokeLinejoin={`round`}
                      strokeWidth={`2`}
                      d={`M4 6h16M4 12h16M4 18h16`}
                    />
                  </svg>
                </button>
              </div>
              <main
                className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
                tabIndex={`0`}
              >
                <div
                  className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
                >
                  <div>
                    <nav className={`sm:hidden`}>
                      <Link
                        href={"/dashboard/site/" + query.siteId + "/overview"}
                      >
                        <a
                          className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          <svg
                            className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Back to Overview
                        </a>
                      </Link>
                    </nav>
                    <nav
                      className={`hidden sm:flex items-center text-sm leading-5`}
                    >
                      <Link
                        href={"/dashboard/site/" + query.siteId + "/overview"}
                      >
                        <a
                          className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          {site.name}
                        </a>
                      </Link>
                      <svg
                        className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Link
                        href={"/dashboard/site/" + query.siteId + "/images"}
                      >
                        <a
                          className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          Images
                        </a>
                      </Link>
                    </nav>
                  </div>
                  <div
                    className={`mt-2 md:flex md:items-center md:justify-between`}
                  >
                    <div className={`flex-1 min-w-0`}>
                      <h2
                        className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}
                      >
                        Images - {site.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className={`max-w-full mx-auto px-4 sm:px-6 md:px-8`}>
                  <LinkOptions searchKey={searchKey} onSearchEvent={searchEventHandler} />
                  <ImageFilter
                    onFilterChange={filterChangeHandler}
                    allFilter={allFilter}
                    imageWorkingFilter={imageWorkingFilter}
                    imageNotWorkingFilter={imageNotWorkingFilter}
                  />
                  <div className={`pb-4`}>
                    <div className={`flex flex-col`}>
                      <div
                        className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
                      >
                        <div
                          className={`align-middle inline-block min-w-full shadow-xs overflow-hidden rounded-lg border-gray-200`}
                        >
                          <table className={`min-w-full`}>
                            <thead>
                              <tr>
                                {ImageTableContent.map((site, key) => {
                                  return (
                                    <Fragment key={key}>
                                      <th
                                        className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                      >
                                        <div className={`flex items-center`}>
                                          <ImageSorting sortOrder={sortOrder} onSortHandler={SortHandler} key={key} slug={site.slug} />
                                          <span className="label">
                                            {site.label}
                                          </span>
                                        </div>
                                      </th>
                                    </Fragment>
                                  )
                                })}
                              </tr>
                            </thead>
                            {image.results &&
                              image.results.map((val, key) => (
                                <ImageTable key={key} val={val} />
                              ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Pagination
                    href="/dashboard/site/[siteId]/images"
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                  />
                </div>
              </main>
            </div>
          </ImagesDiv>
        </Fragment>
      ) : null}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      result: context.query,
    },
  }
}

export default Images