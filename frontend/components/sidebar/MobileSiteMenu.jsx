import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import SitePages from '../../public/data/site-pages.json'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const SiteMenuDiv = styled.nav`
  a:first-child {
    margin-bottom: 1rem;
  }
`

const SiteMenu = () => {
  const { query } = useRouter()
  const {
    data: scan,
    error: scanError,
  } = useSWR(() => (query.id ? `/api/site/${query.id}/scan/` : null), fetcher)

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

  const { data: stats, error: statsError } = useSWR(
    () =>
      query.id && scanObjId
        ? `/api/site/${query.id}/scan/${scanObjId}/`
        : null,
    fetcher
  )

  if (statsError) return <div>{statsError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (!stats) return <div>Loading...</div>
  
  return (
    <SiteMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {SitePages.map((val, key) => {
        return (
          <Link
            key={key}
            href={
              val.url.indexOf("/dashboard/sites") > -1
                ? val.url
                : "/dashboard/site/" + useRouter().query.id + val.url
            }
          >
            <a
              className={`${
                useRouter().asPath.includes("/dashboard/site/" + useRouter().query.id + val.url)  
                  ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                  : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"
              }`}
            >
              <svg
                className={`mr-3 h-6 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                stroke={`currentColor`}
                fill={`none`}
                viewBox={`0 0 24 24`}
              >
                <path
                  strokeLinecap={`round`}
                  strokeLinejoin={`round`}
                  strokeWidth={`2`}
                  d={val.icon}
                />
                {val.icon2 ? (
                  <path
                    strokeLinecap={`round`}
                    strokeLinejoin={`round`}
                    strokeWidth={`2`}
                    d={val.icon2}
                  />
                ) : null}
              </svg>
              <span>{val.title}</span>
              {val.url === "/links" && (
                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                  {stats.num_links}
                </span>
              )}
              {val.url === "/pages" && (
                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                  {stats.num_pages}
                </span>
              )}
            </a>
          </Link>
        );
      })}
    </SiteMenuDiv>
  );
}

export default SiteMenu