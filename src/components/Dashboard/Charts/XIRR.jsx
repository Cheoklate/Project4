import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const XIRRChart = () => {

	const d3Chart = useRef()

	useEffect(()=>{
        
        
    },[])

	return (
		<div id='d3demo'>
			<svg ref={d3Chart}></svg>
		</div>
	)
}

export default XIRRChart;