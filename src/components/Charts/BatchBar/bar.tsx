
import * as echarts from 'echarts';
import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

export default function BatchBar({unbatchedVbytes, batchedVbytes, payjoinVbytes}: {unbatchedVbytes: number, batchedVbytes: number, payjoinVbytes: number}): JSX.Element {
  const [option, setOption] = useState<echarts.EChartsOption | undefined>(undefined);

  useEffect(() => {
    setOption({
      xAxis: {
        type: 'category',
        data: ['Unbatched', 'Batched', 'Payjoin']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [
            {value: unbatchedVbytes, itemStyle: {color: '#ffe751'}}, 
            {value: batchedVbytes, itemStyle: {color: '#81e86a'}},
            {value: payjoinVbytes, itemStyle: {color: '#ff6f6f'}}
          ],
          type: 'bar'
        }
      ]
    });  
  }, [unbatchedVbytes, batchedVbytes, payjoinVbytes]);

  return option && <ReactECharts option={option}/>;
}
  