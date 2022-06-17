import * as React from 'react'

import NavLink from 'next/link';

export function Logo(): JSX.Element {
    return (
        <div className="logo">

            <NavLink href="/">
                <div style={{ "display": "flex" }}>
                    <img className="NavImg" src="https://i.postimg.cc/Lsxrbz02/Logo-2.png" />
                </div>
            </NavLink>
        </div>
    )
}
