import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Link from 'next/link'
import styled from 'styled-components'

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

const SitesStatsDiv = styled.footer``

const SitesStats = () => {
  const { query } = useRouter()
  const {
    data: scan,
    error: scanError,
  } = useSWR(() => (query.id ? `/api/site/${query.id}/scan/` : null), fetcher, {
    refreshInterval: 1000,
  })

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
    fetcher, {
      refreshInterval: 1000,
    }
  )

  if (statsError) return <div>{statsError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (!stats) return <div>Loading...</div>

  return (
    <SitesStatsDiv>
      <div>
        <div className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3`}>
          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={useRouter().asPath + 'pages'}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={useRouter().asPath}>
                  <a
                    disabled={`disabled`} 
                    className={`font-medium text-indigo-300 transition ease-in-out duration-150 cursor-not-allowed`}
                  >
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Working Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_ok_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={useRouter().asPath}>
                  <a
                    disabled={`disabled`} 
                    className={`font-medium text-indigo-300 transition ease-in-out duration-150 cursor-not-allowed`}
                  >
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Links with Issues
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_non_ok_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={useRouter().asPath}>
                  <a
                    disabled={`disabled`} 
                    className={`font-medium text-indigo-300 transition ease-in-out duration-150 cursor-not-allowed`}
                  >
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  External Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_external_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={useRouter().asPath}>
                  <a
                    disabled={`disabled`} 
                    className={`font-medium text-indigo-300 transition ease-in-out duration-150 cursor-not-allowed`}
                  >
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SitesStatsDiv>
  )
}

export default SitesStats
