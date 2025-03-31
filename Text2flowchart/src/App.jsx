import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Input,
  Select,
  Button,
  Upload,
  Card,
  message,
  Row,
  Col,
  Space,
  Divider
} from 'antd';
import ChartPreview from './components/ChartPreview';
import {
  UploadOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const chartTypes = [
  { label: '流程图', value: 'flowchart', description: '适合展示步骤和流程' },
  { label: '思维导图', value: 'mindmap', description: '适合发散性思维和概念整理' },
  { label: '组织结构图', value: 'orgchart', description: '适合展示层级关系' },
  { label: '时间轴', value: 'timeline', description: '适合展示时间序列事件' }
];

const examples = [
  { title: '产品开发流程', content: '需求分析->设计->开发->测试->发布' },
  { title: '年度营销计划', content: '市场分析->目标设定->策略制定->执行->效果评估' },
  { title: '个人职业规划', content: '技能提升->项目经验->职位晋升->领导力培养' }
];

const App = () => {
  const [inputText, setInputText] = useState('');
  const [selectedType, setSelectedType] = useState('flowchart');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const handleFileUpload = (info) => {
    const { status, name } = info.file;
    if (status === 'done') {
      message.success(`${name} 文件上传成功`);
    } else if (status === 'error') {
      message.error(`${name} 文件上传失败`);
    }
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      message.warning('请先输入文字或上传文档，让我们了解您的想法');
      return;
    }
    setLoading(true);
    // 直接更新状态即可，ChartPreview组件会自动重新渲染
    setTimeout(() => {
      setLoading(false);
      message.success('图表生成成功！');
    }, 500);
  };

  const handleDownload = (format) => {
    message.success(`正在下载 ${format} 格式的文件...`);
  };

  const handleShare = () => {
    message.success('分享链接已生成并复制到剪贴板');
  };

  const handleExampleClick = (example) => {
    setInputText(example.content);
  };

  return (
    <div className="app-container">
      <Title level={2}>智能图表生成器 - 让创意可视化</Title>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Card>
            <TextArea
              placeholder="请输入您的想法或描述（支持中英文），例如：\n- 项目开发流程\n- 公司组织架构\n- 产品功能脑图\n- 营销策略规划"
              value={inputText}
              onChange={handleTextChange}
              rows={6}
            />
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <Upload
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="upload-area"
              >
                <Button icon={<UploadOutlined />}>支持拖拽或点击上传txt/word文档</Button>
                <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                  系统将自动提取关键信息生成图表
                </Text>
              </Upload>
              <Select
                style={{ width: '100%' }}
                value={selectedType}
                onChange={handleTypeChange}
                options={chartTypes.map(type => ({
                  label: `${type.label}：${type.description}`,
                  value: type.value
                }))}
              />
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={handleGenerate}
              >
                点击生成，让您的想法跃然纸上
              </Button>
            </Space>
          </Card>

          <div className="chart-container">
            <Title level={4}>图表预览</Title>
            <div className="chart-preview">
              <ChartPreview type={selectedType} content={inputText} />
            </div>
            <Divider />
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload('PNG')}
              >
                下载PNG
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload('SVG')}
              >
                下载SVG
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleDownload('小红书')}
              >
                小红书专用尺寸
              </Button>
              <Button icon={<ShareAltOutlined />} onClick={handleShare}>
                分享
              </Button>
            </Space>
          </div>
        </Col>

        <Col span={8}>
          <Card title="示例模板" extra={<ExperimentOutlined />}>
            <Text type="secondary">不知道如何开始？试试这些示例：</Text>
            <div style={{ marginTop: 16 }}>
              {examples.map((example, index) => (
                <Card
                  key={index}
                  size="small"
                  className="example-card"
                  style={{ marginTop: index > 0 ? 16 : 0 }}
                  onClick={() => handleExampleClick(example)}
                >
                  <Text strong>{example.title}</Text>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;