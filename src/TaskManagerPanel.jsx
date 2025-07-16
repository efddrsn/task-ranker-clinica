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

  // TOP 5 fixo - não pode ser alterado
  const topTasksSeparator = 5;

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

  const getCategoryColor = (category) => {
    const colors = {
      'Administrativo': 'bg-blue-500',
      'RH': 'bg-purple-500',
      'Financeiro': 'bg-green-500',
      'Clínico': 'bg-pink-500',
      'Marketing': 'bg-orange-500',
      'Tecnologia': 'bg-cyan-500',
      'Compliance': 'bg-red-500',
      'Operacional': 'bg-yellow-500',
      'Educação': 'bg-indigo-500',
      'Pacientes': 'bg-teal-500',
      'Emergência': 'bg-red-700',
      'Estratégico': 'bg-purple-700'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryTextColor = (category) => {
    const textColors = {
      'Administrativo': 'text-blue-600',
      'RH': 'text-purple-600',
      'Financeiro': 'text-green-600',
      'Clínico': 'text-pink-600',
      'Marketing': 'text-orange-600',
      'Tecnologia': 'text-cyan-600',
      'Compliance': 'text-red-600',
      'Operacional': 'text-yellow-600',
      'Educação': 'text-indigo-600',
      'Pacientes': 'text-teal-600',
      'Emergência': 'text-red-700',
      'Estratégico': 'text-purple-700'
    };
    return textColors[category] || 'text-gray-600';
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
                ✅ {tasks.length} tarefas • 📱 Arraste com o dedo para reordenar • ✏️ Duplo toque no título para editar
              </div>
            )}
          </div>

          {/* Lista de Tarefas */}
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-base sm:text-lg font-medium mb-2">Nenhuma tarefa carregada</h3>
              <p className="text-sm">Clique em "Carregar Exemplo" para começar ou faça upload de um CSV</p>
            </div>
          ) : (
            <div className="space-y-3 task-list">
              {tasks.map((task, index) => (
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
                    draggable={!editingTask && !editingComment}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, task)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, task)}
                    className={`relative flex items-center p-3 sm:p-4 border rounded-lg transition-all duration-200 ease-in-out touch-manipulation ${
                      !editingTask && !editingComment ? 'cursor-move' : ''
                    } ${
                      draggedTask?.id === task.id 
                        ? 'opacity-40 scale-95 shadow-xl rotate-1 z-50' 
                        : index < topTasksSeparator 
                        ? 'bg-gradient-to-r from-red-50 to-white hover:shadow-md border-red-200' 
                        : 'bg-white hover:shadow-md'
                    } ${
                      draggedOver === task.id 
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                        : index < topTasksSeparator 
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
                    <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 transition-all duration-200 ${
                      index < topTasksSeparator 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
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
                        {index < topTasksSeparator && (
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
                  {draggedTask && dropPosition === tasks.length && index === tasks.length - 1 && (
                    <div className="h-2 bg-blue-200 rounded-full border-2 border-dashed border-blue-400 opacity-75 animate-pulse mx-2">
                      <div className="text-center text-xs text-blue-600 font-medium">
                        ⬇️ Soltar aqui
                      </div>
                    </div>
                  )}

                  {/* Separador Top Tasks FIXO */}
                  {index === topTasksSeparator - 1 && (
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagerPanel;