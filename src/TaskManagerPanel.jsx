import React, { useState } from 'react';

const TaskManagerPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempComment, setTempComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  // TOP 5 fixo - não pode ser alterado
  const topTasksSeparator = 5;

  // Função para obter todas as categorias únicas
  const getUniqueCategories = () => {
    const categories = ['Todas', ...new Set(tasks.map(task => task.category).filter(Boolean))];
    return categories;
  };

  // Função para filtrar tarefas por categoria
  const getFilteredTasks = () => {
    if (selectedCategory === 'Todas') {
      return tasks;
    }
    return tasks.filter(task => task.category === selectedCategory);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('Arquivo vazio');
      }

      // Verificar se a primeira linha é um cabeçalho
      const firstLine = lines[0].split(',');
      let startIndex = 0;
      
      // Se a primeira linha contém "tarefa" e "categoria", pular cabeçalho
      if (firstLine.some(col => col.toLowerCase().includes('tarefa')) && 
          firstLine.some(col => col.toLowerCase().includes('categoria'))) {
        startIndex = 1;
      }

      const newTasks = [];
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(item => item.trim().replace(/"/g, ''));
        const [taskTitle, category, comments = ''] = columns;
        
        if (taskTitle && category) {
          newTasks.push({
            id: Date.now() + i,
            title: taskTitle,
            category: category,
            comments: comments
          });
        }
      }

      if (newTasks.length === 0) {
        throw new Error('Nenhuma tarefa válida encontrada. Verifique o formato: tarefa,categoria[,comentarios]');
      }

      setTasks(newTasks);
      
    } catch (error) {
      setUploadError(`Erro ao processar arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Limpar o input para permitir re-upload do mesmo arquivo
      event.target.value = '';
    }
  };

  const loadExampleData = () => {
    const exampleTasks = [
      { id: Date.now() + 1, title: 'Revisar contratos de convênios', category: 'Administrativo', comments: '' },
      { id: Date.now() + 2, title: 'Processo seletivo para nova recepcionista', category: 'RH', comments: '' },
      { id: Date.now() + 3, title: 'Análise do fluxo de caixa mensal', category: 'Financeiro', comments: '' },
      { id: Date.now() + 4, title: 'Atualizar protocolos de esterilização', category: 'Clínico', comments: '' },
      { id: Date.now() + 5, title: 'Planejar campanha de marketing digital', category: 'Marketing', comments: '' },
      { id: Date.now() + 6, title: 'Manutenção preventiva dos equipamentos', category: 'Tecnologia', comments: '' },
      { id: Date.now() + 7, title: 'Renovar licenças da vigilância sanitária', category: 'Compliance', comments: '' },
      { id: Date.now() + 8, title: 'Gerenciar agenda dos dentistas', category: 'Operacional', comments: '' },
      { id: Date.now() + 9, title: 'Participar de congresso odontológico', category: 'Educação', comments: '' },
      { id: Date.now() + 10, title: 'Atender reclamações de pacientes', category: 'Pacientes', comments: '' },
      { id: Date.now() + 11, title: 'Lidar com equipamento quebrado', category: 'Emergência', comments: '' },
      { id: Date.now() + 12, title: 'Definir metas anuais da clínica', category: 'Estratégico', comments: '' }
    ];
    
    setTasks(exampleTasks);
  };

  const downloadSampleFile = () => {
    const sampleData = `tarefa,categoria
Revisar contratos de convênios,Administrativo
Processo seletivo para nova recepcionista,RH
Análise do fluxo de caixa mensal,Financeiro
Atualizar protocolos de esterilização,Clínico
Planejar campanha de marketing digital,Marketing
Manutenção preventiva dos equipamentos,Tecnologia
Renovar licenças da vigilância sanitária,Compliance
Gerenciar agenda dos dentistas,Operacional
Participar de congresso odontológico,Educação
Atender reclamações de pacientes,Pacientes
Lidar com equipamento quebrado,Emergência
Definir metas anuais da clínica,Estratégico`;

    const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tarefas_exemplo.csv';
    link.click();
  };

  const exportCurrentRanking = () => {
    if (tasks.length === 0) {
      alert('Nenhuma tarefa para exportar');
      return;
    }

    const csvHeader = 'Posição,Tarefa,Categoria,Comentários,Status\n';
    const csvContent = tasks.map((task, index) => {
      const position = index + 1;
      const status = index < topTasksSeparator ? 'TOP' : 'Normal';
      const title = `"${task.title.replace(/"/g, '""')}"`;
      const comments = `"${(task.comments || '').replace(/"/g, '""')}"`;
      return `${position},${title},${task.category},${comments},${status}`;
    }).join('\n');

    const fullContent = csvHeader + csvContent;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    link.download = `ranking-tarefas-${timestamp}.csv`;
    link.click();
  };

  const clearTasks = () => {
    if (confirm('Tem certeza que deseja limpar todas as tarefas?')) {
      setTasks([]);
    }
  };

  // Funções de edição
  const startEditingTitle = (task) => {
    setEditingTask(task.id);
    setTempTitle(task.title);
  };

  const startEditingComment = (task) => {
    setEditingComment(task.id);
    setTempComment(task.comments || '');
  };

  const saveTitle = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, title: tempTitle.trim() || task.title }
        : task
    ));
    setEditingTask(null);
    setTempTitle('');
  };

  const saveComment = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: tempComment.trim() }
        : task
    ));
    setEditingComment(null);
    setTempComment('');
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditingComment(null);
    setTempTitle('');
    setTempComment('');
  };

  const handleKeyPress = (e, saveFunction, taskId) => {
    if (e.key === 'Enter') {
      saveFunction(taskId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    setDropPosition(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, task, position = 'middle') => {
    e.preventDefault();
    if (!draggedTask || draggedTask.id === task.id) return;
    
    const targetIndex = tasks.findIndex(t => t.id === task.id);
    setDraggedOver(task.id);
    
    if (position === 'top') {
      setDropPosition(targetIndex);
    } else if (position === 'bottom') {
      setDropPosition(targetIndex + 1);
    } else {
      setDropPosition(targetIndex);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Só limpar se realmente saiu da área
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e, targetTask) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.id === targetTask.id) return;
    
    const draggedIndex = tasks.findIndex(t => t.id === draggedTask.id);
    let targetIndex = dropPosition !== null ? dropPosition : tasks.findIndex(t => t.id === targetTask.id);
    
    // Ajustar índice se estamos movendo para frente
    if (draggedIndex < targetIndex) {
      targetIndex--;
    }
    
    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);
    
    setTasks(newTasks);
    setDraggedTask(null);
    setDraggedOver(null);
    setDropPosition(null);
  };

  // Gera uma cor consistente baseada no nome da categoria
  const generateCategoryColor = (category) => {
    // Hash simples para garantir consistência
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      const char = category.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Palette de cores predefinidas que funcionam bem juntas
    const colorPalette = [
      { bg: 'bg-blue-500', text: 'text-blue-600' },
      { bg: 'bg-purple-500', text: 'text-purple-600' },
      { bg: 'bg-green-500', text: 'text-green-600' },
      { bg: 'bg-pink-500', text: 'text-pink-600' },
      { bg: 'bg-orange-500', text: 'text-orange-600' },
      { bg: 'bg-cyan-500', text: 'text-cyan-600' },
      { bg: 'bg-red-500', text: 'text-red-600' },
      { bg: 'bg-yellow-500', text: 'text-yellow-600' },
      { bg: 'bg-indigo-500', text: 'text-indigo-600' },
      { bg: 'bg-teal-500', text: 'text-teal-600' },
      { bg: 'bg-rose-500', text: 'text-rose-600' },
      { bg: 'bg-emerald-500', text: 'text-emerald-600' },
      { bg: 'bg-violet-500', text: 'text-violet-600' },
      { bg: 'bg-amber-500', text: 'text-amber-600' },
      { bg: 'bg-lime-500', text: 'text-lime-600' },
      { bg: 'bg-sky-500', text: 'text-sky-600' },
      { bg: 'bg-fuchsia-500', text: 'text-fuchsia-600' },
      { bg: 'bg-slate-500', text: 'text-slate-600' }
    ];
    
    // Usa o hash para selecionar uma cor da palette
    const colorIndex = Math.abs(hash) % colorPalette.length;
    return colorPalette[colorIndex];
  };

  // Memoização das cores das categorias para garantir consistência
  const getCategoryColors = (category) => {
    if (!category) return { bg: 'bg-gray-500', text: 'text-gray-600' };
    
    // Gera cores baseadas no nome da categoria
    return generateCategoryColor(category);
  };

  const getCategoryColor = (category) => {
    return getCategoryColors(category).bg;
  };

  const getCategoryTextColor = (category) => {
    return getCategoryColors(category).text;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            Lista de Tarefas - Clínica Odontológica
          </h1>

          {/* Upload Section */}
          <div className="mb-4 p-3 bg-gray-100 rounded border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Upload CSV (tarefa,categoria)
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 disabled:opacity-50"
                />
              </div>
              
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={loadExampleData}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  📋 Carregar Exemplo
                </button>
                
                <button
                  onClick={downloadSampleFile}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-xs sm:text-sm font-medium"
                >
                  📥 Baixar CSV
                </button>
                
                {tasks.length > 0 && (
                  <>
                    <button
                      onClick={exportCurrentRanking}
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                    >
                      💾 Exportar
                    </button>
                    
                    <button
                      onClick={clearTasks}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs sm:text-sm font-medium"
                    >
                      🗑️ Limpar
                    </button>
                  </>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="text-blue-600 text-xs mt-1">
                ⏳ Processando...
              </div>
            )}

            {uploadError && (
              <div className="text-red-600 text-xs bg-red-50 p-1 rounded mt-1">
                ❌ {uploadError}
              </div>
            )}

            {tasks.length > 0 && (
              <div className="text-green-600 text-xs mt-1">
                ✅ {tasks.length} tarefas carregadas
                {selectedCategory !== 'Todas' && (
                  <span className="text-blue-600"> • 🔍 {getFilteredTasks().length} filtradas</span>
                )}
                <span className="text-gray-600"> • 📱 Arraste com o dedo para reordenar • ✏️ Duplo toque no título para editar</span>
              </div>
            )}
          </div>

          {/* Command Bar - Filtros de Categoria */}
          {tasks.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-gray-700 flex-shrink-0">Filtrar por categoria:</span>
                <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="flex gap-2 pb-2 px-1" style={{ minWidth: 'max-content' }}>
                    {getUniqueCategories().map((category) => {
                      const isSelected = selectedCategory === category;
                      const isAllTasks = category === 'Todas';
                      const categoryColors = isAllTasks ? { bg: 'bg-gray-500', text: 'text-gray-600' } : getCategoryColors(category);
                      
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border-2 ${
                            isSelected
                              ? `${categoryColors.bg} text-white shadow-md transform scale-105 border-transparent`
                              : `bg-white ${categoryColors.text} hover:bg-gray-50 hover:shadow-sm border-gray-300 hover:border-gray-400`
                          }`}
                        >
                          {isAllTasks ? '🔍 ' : '🏷️ '}{category}
                          <span className="ml-1 text-xs opacity-75">
                            ({isAllTasks ? tasks.length : tasks.filter(task => task.category === category).length})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                💡 <strong>Dica:</strong> Role horizontalmente para ver mais categorias
              </div>
            </div>
          )}

          {/* Lista de Tarefas */}
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Nenhuma tarefa carregada</h3>
              <p className="text-sm">Clique em "Carregar Exemplo" para começar ou faça upload de um CSV</p>
            </div>
          ) : (
            <div className="space-y-3 task-list">
              {getFilteredTasks().map((task, index) => {
                // Encontrar o índice real da tarefa na lista completa
                const realIndex = tasks.findIndex(t => t.id === task.id);
                
                return (
                <React.Fragment key={task.id}>
                  {/* Drop zone antes do card */}
                  {draggedTask && dropPosition === index && (
                    <div className="h-2 bg-blue-200 rounded-full border-2 border-dashed border-blue-400 opacity-75 animate-pulse mx-2">
                      <div className="text-center text-xs text-blue-600 font-medium">
                        ⬇️ Soltar aqui
                      </div>
                    </div>
                  )}

                  <div
                    data-task-card
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, task)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, task)}
                    className={`relative flex items-center p-3 sm:p-4 border rounded-lg transition-all duration-200 ease-in-out touch-manipulation ${
                      draggedTask?.id === task.id 
                        ? 'opacity-40 scale-95 shadow-xl rotate-1 z-50' 
                        : realIndex < topTasksSeparator 
                        ? 'bg-gradient-to-r from-red-50 to-white hover:shadow-md border-red-200' 
                        : 'bg-white hover:shadow-md'
                    } ${
                      draggedOver === task.id 
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                        : realIndex < topTasksSeparator 
                        ? 'border-red-200' 
                        : 'border-gray-200'
                    } ${
                      draggedTask && draggedTask.id !== task.id ? 'transform transition-transform duration-200' : ''
                    }`}
                    style={{
                      transform: draggedTask && draggedTask.id !== task.id && dropPosition !== null && index >= dropPosition 
                        ? 'translateY(8px)' 
                        : 'translateY(0px)',
                      touchAction: 'manipulation'
                    }}
                  >
                    {/* Drop zones nos extremos do card para mobile */}
                    <div 
                      className="absolute -top-1 left-0 right-0 h-3 opacity-0 hover:opacity-100"
                      onDragEnter={(e) => handleDragEnter(e, task, 'top')}
                    ></div>
                    <div 
                      className="absolute -bottom-1 left-0 right-0 h-3 opacity-0 hover:opacity-100"
                      onDragEnter={(e) => handleDragEnter(e, task, 'bottom')}
                    ></div>

                    {/* Ranking */}
                    <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 transition-all duration-200 ${
                      realIndex < topTasksSeparator 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {realIndex + 1}
                    </div>

                    {/* Drag Handle */}
                    <div 
                      draggable={!editingTask && !editingComment}
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`flex-shrink-0 p-1 sm:p-2 mr-2 sm:mr-3 rounded-md transition-all duration-200 group ${
                        !editingTask && !editingComment 
                          ? 'cursor-grab hover:bg-gray-200 active:cursor-grabbing active:bg-gray-300' 
                          : 'cursor-default opacity-50'
                      }`}
                      title="Arraste aqui para reordenar"
                    >
                      <svg 
                        width="12" 
                        height="16" 
                        viewBox="0 0 12 16" 
                        className={`${!editingTask && !editingComment ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-300'} transition-colors`}
                        fill="currentColor"
                      >
                        <circle cx="2" cy="2" r="1.5"/>
                        <circle cx="10" cy="2" r="1.5"/>
                        <circle cx="2" cy="8" r="1.5"/>
                        <circle cx="10" cy="8" r="1.5"/>
                        <circle cx="2" cy="14" r="1.5"/>
                        <circle cx="10" cy="14" r="1.5"/>
                      </svg>
                    </div>

                    {/* Indicador de Categoria */}
                    <div className={`flex-shrink-0 w-1 h-12 sm:h-16 rounded-full ${getCategoryColor(task.category)} mr-3 sm:mr-4`}></div>

                    {/* Conteúdo da Tarefa */}
                    <div className="flex-1 min-w-0">
                      {/* Título editável */}
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={() => saveTitle(task.id)}
                          onKeyDown={(e) => handleKeyPress(e, saveTitle, task.id)}
                          className="font-semibold text-gray-800 mb-1 w-full p-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className="font-semibold text-gray-800 mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors text-sm sm:text-base leading-tight"
                          onDoubleClick={() => startEditingTitle(task)}
                          title="Duplo clique para editar"
                        >
                          {task.title}
                        </h3>
                      )}
                      
                      {/* Categoria e tags */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className={`text-xs sm:text-sm ${getCategoryTextColor(task.category)} font-medium`}>
                          {task.category}
                        </div>
                        {realIndex < topTasksSeparator && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            TOP
                          </span>
                        )}
                      </div>

                      {/* Comentários editáveis */}
                      {editingComment === task.id ? (
                        <input
                          type="text"
                          value={tempComment}
                          onChange={(e) => setTempComment(e.target.value)}
                          onBlur={() => saveComment(task.id)}
                          onKeyDown={(e) => handleKeyPress(e, saveComment, task.id)}
                          className="text-xs sm:text-sm text-gray-600 w-full p-1 border border-blue-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="Adicionar comentário..."
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-xs sm:text-sm text-gray-600 cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[20px] transition-colors"
                          onClick={() => startEditingComment(task)}
                          title="Clique para editar comentário"
                        >
                          {task.comments || <span className="text-gray-400 italic">Toque para adicionar comentário...</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drop zone depois do último card */}
                  {draggedTask && dropPosition === getFilteredTasks().length && index === getFilteredTasks().length - 1 && (
                    <div className="h-2 bg-blue-200 rounded-full border-2 border-dashed border-blue-400 opacity-75 animate-pulse mx-2">
                      <div className="text-center text-xs text-blue-600 font-medium">
                        ⬇️ Soltar aqui
                      </div>
                    </div>
                  )}

                  {/* Separador Top Tasks FIXO */}
                  {realIndex === topTasksSeparator - 1 && selectedCategory === 'Todas' && (
                    <div className="flex items-center justify-center py-3 rounded-lg">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 h-1 bg-red-500 rounded"></div>
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-100 rounded-full border-2 border-red-300">
                          <span className="text-sm font-bold text-red-700">TOP {topTasksSeparator}</span>
                          <span className="text-xs text-red-600 hidden sm:inline">• Fixo</span>
                        </div>
                        <div className="flex-1 h-1 bg-red-500 rounded"></div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagerPanel;