import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import {
  Description,
  Image,
  VideoFile,
  AudioFile,
  Archive,
  MoreVert,
  Download,
  Delete,
  Visibility,
  Folder
} from '@mui/icons-material';
import FileListHeader from '../FileListHeader';
import ResizablePanels from '../ResizablePanels';
import './FileListDemo.css';

const FileListDemo = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterBy, setFilterBy] = useState('all');

  // Mock file data
  const [files] = useState([
    {
      id: 1,
      name: 'Project Proposal.pdf',
      type: 'document',
      size: '2.4 MB',
      modified: '2024-01-15',
      icon: <Description sx={{ color: '#ef4444' }} />
    },
    {
      id: 2,
      name: 'Team Photo.jpg',
      type: 'image',
      size: '1.8 MB',
      modified: '2024-01-14',
      icon: <Image sx={{ color: '#10b981' }} />
    },
    {
      id: 3,
      name: 'Presentation.mp4',
      type: 'video',
      size: '45.2 MB',
      modified: '2024-01-13',
      icon: <VideoFile sx={{ color: '#3b82f6' }} />
    },
    {
      id: 4,
      name: 'Meeting Audio.mp3',
      type: 'audio',
      size: '12.7 MB',
      modified: '2024-01-12',
      icon: <AudioFile sx={{ color: '#8b5cf6' }} />
    },
    {
      id: 5,
      name: 'Backup Files.zip',
      type: 'archive',
      size: '156.3 MB',
      modified: '2024-01-11',
      icon: <Archive sx={{ color: '#f59e0b' }} />
    },
    {
      id: 6,
      name: 'Technical Specs.docx',
      type: 'document',
      size: '3.1 MB',
      modified: '2024-01-10',
      icon: <Description sx={{ color: '#ef4444' }} />
    },
    {
      id: 7,
      name: 'Screenshot.png',
      type: 'image',
      size: '0.8 MB',
      modified: '2024-01-09',
      icon: <Image sx={{ color: '#10b981' }} />
    },
    {
      id: 8,
      name: 'Tutorial Video.mp4',
      type: 'video',
      size: '89.5 MB',
      modified: '2024-01-08',
      icon: <VideoFile sx={{ color: '#3b82f6' }} />
    }
  ]);

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      if (filterBy === 'all') return true;
      return file.type === filterBy;
    })
    .filter(file => {
      if (!searchQuery) return true;
      return file.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-desc':
          return new Date(b.modified) - new Date(a.modified);
        case 'date-asc':
          return new Date(a.modified) - new Date(b.modified);
        default:
          return 0;
      }
    });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddFile = () => {
    console.log('Add file clicked');
    // Implement file upload logic here
  };

  const handleRefresh = () => {
    console.log('Refresh clicked');
    // Implement refresh logic here
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  const handleFilter = (filterOption) => {
    setFilterBy(filterOption);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'document': return '#ef4444';
      case 'image': return '#10b981';
      case 'video': return '#3b82f6';
      case 'audio': return '#8b5cf6';
      case 'archive': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const renderListView = () => (
    <Paper sx={{ height: '100%', overflow: 'auto' }}>
      <List>
        {filteredAndSortedFiles.map((file, index) => (
          <React.Fragment key={file.id}>
            <ListItem
              sx={{
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
                transition: 'background-color 0.2s ease',
              }}
            >
              <ListItemIcon>
                {file.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {file.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                    <Chip
                      label={file.type.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: `${getFileTypeColor(file.type)}20`,
                        color: getFileTypeColor(file.type),
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {file.size}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Modified: {file.modified}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="view">
                  <Visibility />
                </IconButton>
                <IconButton edge="end" aria-label="download">
                  <Download />
                </IconButton>
                <IconButton edge="end" aria-label="more">
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            {index < filteredAndSortedFiles.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );

  const renderGridView = () => (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Grid container spacing={2}>
        {filteredAndSortedFiles.map((file) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {React.cloneElement(file.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" component="h3" noWrap>
                  {file.name}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={file.type.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: `${getFileTypeColor(file.type)}20`,
                      color: getFileTypeColor(file.type),
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {file.size}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file.modified}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', gap: 1 }}>
                <IconButton size="small" aria-label="view">
                  <Visibility />
                </IconButton>
                <IconButton size="small" aria-label="download">
                  <Download />
                </IconButton>
                <IconButton size="small" aria-label="delete">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const leftPanel = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <FileListHeader
        title="File Manager"
        fileCount={filteredAndSortedFiles.length}
        onSearch={handleSearch}
        onAddFile={handleAddFile}
        onRefresh={handleRefresh}
        onSort={handleSort}
        onFilter={handleFilter}
        onViewModeChange={handleViewModeChange}
        viewMode={viewMode}
      />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {viewMode === 'list' ? renderListView() : renderGridView()}
      </Box>
    </Box>
  );

  const rightPanel = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        File Details
      </Typography>
      <Paper sx={{ p: 2, flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Select a file from the list to view its details here.
        </Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <ResizablePanels
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        initialLeftWidth={70}
        minLeftWidth={40}
        maxLeftWidth={90}
      />
    </Box>
  );
};

export default FileListDemo; 