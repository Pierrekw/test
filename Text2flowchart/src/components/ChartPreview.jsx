import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Typography } from 'antd';

const { Text } = Typography;

// 初始化mermaid配置
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'sans-serif'
});

const ChartPreview = ({ type, content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!content) return;

    const renderChart = async () => {
      try {
        // 清空容器
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // 根据类型构建mermaid语法
        let mermaidContent = '';
        switch (type) {
          case 'flowchart':
            mermaidContent = `graph TD\n${content.split('->').join('-->')}`;
            break;
          case 'mindmap':
            mermaidContent = `mindmap\n${content.split('->').join('\n    ')}`;
            break;
          case 'orgchart':
            mermaidContent = `graph TB\n${content.split('->').join('-->')}`;
            break;
          case 'timeline':
            mermaidContent = `timeline\n${content.split('->').join('\n    ')}`;
            break;
          default:
            mermaidContent = `graph TD\n${content}`;
        }

        // 渲染图表
        const { svg } = await mermaid.render('mermaid-chart', mermaidContent);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('图表渲染失败:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '<div style="color: red;">图表渲染失败，请检查输入格式</div>';
        }
      }
    };

    renderChart();
  }, [type, content]);

  if (!content) {
    return <Text type="secondary">请在上方输入内容并选择图表类型</Text>;
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '300px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    />
  );
};

export default ChartPreview;