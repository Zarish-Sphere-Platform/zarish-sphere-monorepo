import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Copy, Undo2, Redo2, Download, Eye } from 'lucide-react';
import './GUIBuilder.css';

export interface GUIComponent {
  id: string;
  type: 'button' | 'input' | 'text' | 'card' | 'container' | 'form' | 'image' | 'heading';
  label?: string;
  placeholder?: string;
  children?: GUIComponent[];
  props?: Record<string, any>;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface BuiltApplication {
  id: string;
  name: string;
  description: string;
  components: GUIComponent[];
  createdAt: Date;
  updatedAt: Date;
}

const COMPONENT_PALETTE = [
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'input', label: 'Input Field', icon: '📝' },
  { type: 'text', label: 'Text', icon: '📄' },
  { type: 'heading', label: 'Heading', icon: '📌' },
  { type: 'card', label: 'Card', icon: '📦' },
  { type: 'container', label: 'Container', icon: '📐' },
  { type: 'form', label: 'Form', icon: '📋' },
  { type: 'image', label: 'Image', icon: '🖼️' },
];

export const GUIBuilder: React.FC = () => {
  const [components, setComponents] = useState<GUIComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<GUIComponent[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [appName, setAppName] = useState('My Application');
  const [appDescription, setAppDescription] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const selectedComponent = selectedId
    ? findComponentById(components, selectedId)
    : null;

  // History management
  const updateHistory = useCallback((newComponents: GUIComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newComponents);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setComponents(newComponents);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Component management
  const addComponent = useCallback((type: string) => {
    const newComponent: GUIComponent = {
      id: uuidv4(),
      type: type as any,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      size: { width: 200, height: 50 },
      children: [],
    };
    updateHistory([...components, newComponent]);
  }, [components, updateHistory]);

  const deleteComponent = useCallback((id: string) => {
    const newComponents = components.filter(c => c.id !== id);
    updateHistory(newComponents);
    if (selectedId === id) setSelectedId(null);
  }, [components, selectedId, updateHistory]);

  const duplicateComponent = useCallback((id: string) => {
    const component = findComponentById(components, id);
    if (component) {
      const newComponent = {
        ...JSON.parse(JSON.stringify(component)),
        id: uuidv4(),
      };
      updateHistory([...components, newComponent]);
    }
  }, [components, updateHistory]);

  const updateComponent = useCallback((id: string, updates: Partial<GUIComponent>) => {
    const newComponents = updateComponentById(components, id, updates);
    updateHistory(newComponents);
  }, [components, updateHistory]);

  const exportJSON = useCallback(() => {
    const app: BuiltApplication = {
      id: uuidv4(),
      name: appName,
      description: appDescription,
      components,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const json = JSON.stringify(app, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.replace(/\s+/g, '-')}.json`;
    a.click();
  }, [components, appName, appDescription]);

  if (previewMode) {
    return (
      <div className="gui-builder-preview">
        <div className="preview-header">
          <h2>{appName}</h2>
          <Button onClick={() => setPreviewMode(false)}>Back to Edit</Button>
        </div>
        <div className="preview-content">
          <ComponentRenderer components={components} />
        </div>
      </div>
    );
  }

  return (
    <div className="gui-builder-container">
      <div className="gui-builder-header">
        <div className="header-title">
          <h1>GUI Builder</h1>
          <p>Drag and drop components to build your application</p>
        </div>
        <div className="header-actions">
          <Button onClick={undo} disabled={historyIndex === 0} size="sm">
            <Undo2 className="w-4 h-4" /> Undo
          </Button>
          <Button onClick={redo} disabled={historyIndex === history.length - 1} size="sm">
            <Redo2 className="w-4 h-4" /> Redo
          </Button>
          <Button onClick={() => setPreviewMode(true)} variant="outline" size="sm">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button onClick={exportJSON} variant="outline" size="sm">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="gui-builder-content">
        {/* Component Palette */}
        <div className="component-palette">
          <h3>Components</h3>
          <div className="palette-grid">
            {COMPONENT_PALETTE.map(comp => (
              <button
                key={comp.type}
                className="palette-item"
                onClick={() => addComponent(comp.type)}
                title={comp.label}
              >
                <span className="palette-icon">{comp.icon}</span>
                <span className="palette-label">{comp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="canvas-area">
          <div className="canvas-header">
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Application Name"
              className="app-name-input"
            />
          </div>
          <div className="canvas">
            <div className="canvas-grid">
              {components.length === 0 ? (
                <div className="canvas-empty">
                  <p>Drag components here to start building</p>
                </div>
              ) : (
                <div className="components-list">
                  {components.map(comp => (
                    <CanvasComponent
                      key={comp.id}
                      component={comp}
                      isSelected={selectedId === comp.id}
                      onSelect={() => setSelectedId(comp.id)}
                      onDelete={() => deleteComponent(comp.id)}
                      onDuplicate={() => duplicateComponent(comp.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="properties-panel">
          <h3>Properties</h3>
          {selectedComponent ? (
            <div className="properties-form">
              <div className="form-group">
                <Label>Component Type</Label>
                <Input value={selectedComponent.type} disabled />
              </div>
              <div className="form-group">
                <Label>Label</Label>
                <Input
                  value={selectedComponent.label || ''}
                  onChange={(e) =>
                    updateComponent(selectedComponent.id, { label: e.target.value })
                  }
                  placeholder="Component label"
                />
              </div>
              {selectedComponent.type === 'input' && (
                <div className="form-group">
                  <Label>Placeholder</Label>
                  <Input
                    value={selectedComponent.placeholder || ''}
                    onChange={(e) =>
                      updateComponent(selectedComponent.id, { placeholder: e.target.value })
                    }
                    placeholder="Input placeholder"
                  />
                </div>
              )}
              <div className="form-group">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={selectedComponent.size?.width || 200}
                  onChange={(e) =>
                    updateComponent(selectedComponent.id, {
                      size: { width: parseInt(e.target.value), height: selectedComponent.size?.height || 50 },
                    })
                  }
                />
              </div>
              <div className="form-group">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={selectedComponent.size?.height || 50}
                  onChange={(e) =>
                    updateComponent(selectedComponent.id, {
                      size: { width: selectedComponent.size?.width || 200, height: parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="properties-actions">
                <Button
                  onClick={() => duplicateComponent(selectedComponent.id)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </Button>
                <Button
                  onClick={() => deleteComponent(selectedComponent.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              </div>
            </div>
          ) : (
            <p className="no-selection">Select a component to edit properties</p>
          )}
        </div>
      </div>
    </div>
  );
};

interface CanvasComponentProps {
  component: GUIComponent;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}) => {
  return (
    <div
      className={`canvas-component ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{
        width: component.size?.width,
        height: component.size?.height,
      }}
    >
      <div className="component-content">
        <span className="component-type">{component.type}</span>
        {component.label && <span className="component-label">{component.label}</span>}
      </div>
      {isSelected && (
        <div className="component-actions">
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} title="Delete">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

interface ComponentRendererProps {
  components: GUIComponent[];
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ components }) => {
  return (
    <div className="component-renderer">
      {components.map(comp => (
        <RenderComponent key={comp.id} component={comp} />
      ))}
    </div>
  );
};

const RenderComponent: React.FC<{ component: GUIComponent }> = ({ component }) => {
  switch (component.type) {
    case 'button':
      return <Button>{component.label || 'Button'}</Button>;
    case 'input':
      return <Input placeholder={component.placeholder || 'Enter text...'} />;
    case 'text':
      return <p>{component.label || 'Text'}</p>;
    case 'heading':
      return <h2>{component.label || 'Heading'}</h2>;
    case 'card':
      return (
        <Card className="p-4">
          <p>{component.label || 'Card content'}</p>
        </Card>
      );
    case 'container':
      return (
        <div className="border p-4 rounded">
          {component.children?.map(child => (
            <RenderComponent key={child.id} component={child} />
          ))}
        </div>
      );
    default:
      return <div>{component.label || component.type}</div>;
  }
};

// Helper functions
function findComponentById(
  components: GUIComponent[],
  id: string
): GUIComponent | null {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.children) {
      const found = findComponentById(comp.children, id);
      if (found) return found;
    }
  }
  return null;
}

function updateComponentById(
  components: GUIComponent[],
  id: string,
  updates: Partial<GUIComponent>
): GUIComponent[] {
  return components.map(comp => {
    if (comp.id === id) {
      return { ...comp, ...updates };
    }
    if (comp.children) {
      return {
        ...comp,
        children: updateComponentById(comp.children, id, updates),
      };
    }
    return comp;
  });
}
