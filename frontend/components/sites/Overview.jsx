import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Moment from 'react-moment'

const SitesOverviewDiv = styled.div``

const SitesOverview = props => {
  const calendarStrings = {
    lastDay : '[Yesterday], dddd [at]',
    sameDay : '[Today], dddd [at]',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  return (
    <SitesOverviewDiv className={`bg-white shadow sm:rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <h2 className={`text-lg leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
          <a href={`${props.url}`} target={`_blank`} title={`${props.url}`}>
            {props.url}
          </a>
        </h2>
        <div className={`mt-5 mb-3 max-w-xl text-sm leading-5 text-gray-500`}>
          <div className={`mb-2 flex`}>
            <strong>Site Status:</strong>
            {props.verified ? (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-green-100 text-green-800`}>Verified</span>
              </div>
            ): (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-red-100 text-red-800`}>Unverified</span>
              </div>
            )}
          </div>
        </div>
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-500`}>
          <p>
            <strong>Created on:</strong> <Moment local calendar={calendarStrings} date={props.createdAt} />&nbsp;
            <Moment local date={props.createdAt} format="hh:mm:ss A" />
          </p>
        </div>
      </div>
    </SitesOverviewDiv>
  );
}

export default SitesOverview

SitesOverview.propTypes = {}