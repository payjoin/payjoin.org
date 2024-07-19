
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function BatchBar({unbatchedVbytes, batchedVbytes}: {unbatchedVbytes: number, batchedVbytes: number}): JSX.Element {

  const [option, setOption] = useState<echarts.EChartsOption | undefined>(undefined);


  useEffect(() => {

    setOption({
      xAxis: {
        type: 'category',
        data: ['Unbatched', 'Batched']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [unbatchedVbytes, batchedVbytes],
          type: 'bar'
        }
      ]
    }); 

 
  
  }, [unbatchedVbytes, batchedVbytes]);

  console.log(unbatchedVbytes, batchedVbytes, {option});

    return batchedVbytes !== undefined && unbatchedVbytes !== undefined && !!option ? <ReactECharts option={option}/>: <>nada</>;
  }
  