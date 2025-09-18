<!-- <template>
    <div class="CheckMatchBox">
       <div class="CheckTitle">查询比赛</div>
       <hr>
       <div class="SearchBox">
        <span>比赛名称:</span>
        <input class="SearchInput" type="text">
       </div>
       <div class="ButtonBox">
            <button class="SearchButton">检索</button>
            <button class="ResetButton">重置</button>
       </div>
    </div>
    <div class="SearchResultsBox">
        <div class="SearchResultsTitle">查询结果</div>
        <hr>
        <div>
            <ul>
                <li>比赛项目</li>
                <li>开始时间</li>
                <li>结束时间</li>
                <li>比赛人数</li>
                <li>参与人数</li>
                <li>裁判ID</li>
                <li>规则</li>
            </ul>
        </div>
    </div>
</template> -->


<template>
  <div class="match-list-container">
    <div class="header-actions">
      <h2 class="page-title">比赛列表</h2>
      <button class="add-toggle-btn" @click="toggleAddForm">
        <i class="add-icon">{{ showAddForm ? '−' : '+' }}</i> 
        {{ showAddForm ? '收起新增表单' : '新增比赛' }}
      </button>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchKeyword"
        @input="handleSearch"
        placeholder="请输入比赛名称搜索..."
        class="search-input"
      >
      <button 
        class="reset-btn" 
        @click="resetSearch"
        :disabled="!searchKeyword"
      >
        重置
      </button>
    </div>
    
    <div class="table-container">
      <table class="match-table">
        <thead>
          <tr>
            <th>比赛ID</th>
            <th>比赛名称</th>
            <th>比赛开始时间</th>
            <th>比赛结束时间</th>
            <th>比赛人数</th>
            <th>参与人数</th>
            <th>裁判ID</th>
            <th>规则</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match in currentPageData" :key="match.id" class="match-row">
            <td>{{ match.id }}</td>
            <td>{{ match.name }}</td>
            <td>{{ formatDateTime(match.startTime) }}</td>
            <td>{{ formatDateTime(match.endTime) }}</td>
            <td>{{ match.totalPlayers }}</td>
            <td>{{ match.participatedPlayers }}</td>
            <td>{{ match.refereeId }}</td>
            <td class="rules-cell">{{ match.rules }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="match.status === 1 ? 'status-active' : 'status-inactive'"
              >
                {{ match.status === 1 ? '启动' : '禁用' }}
              </span>
            </td>
            <td class="actions-cell">
              <button 
                class="edit-btn" 
                @click="handleEdit(match)"
                title="编辑"
              >
                <i class="edit-icon">✏️</i> 编辑
              </button>
              <button 
                class="delete-btn" 
                @click="handleDelete(match.id)"
                title="删除"
              >
                <i class="delete-icon">🗑️</i> 删除
              </button>
              <button 
                class="status-btn" 
                :class="match.status === 1 ? 'status-btn-active' : 'status-btn-inactive'"
                @click="handleStatusChange(match.id)"
                title="切换状态"
              >
                {{ match.status === 1 ? '禁用' : '启动' }}
              </button>
            </td>
          </tr>
          <tr v-if="currentPageData.length === 0">
            <td colspan="10" class="no-data">
              {{ searchKeyword ? '没有找到匹配的比赛' : '暂无数据' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页控件 -->
    <div class="pagination" v-if="filteredMatches.length > 0 && totalPages > 1">
      <button 
        class="page-btn" 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
      >
        首页
      </button>
      <button 
        class="page-btn" 
        @click="currentPage--" 
        :disabled="currentPage === 1"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页 (共 {{ filteredMatches.length }} 条)
      </span>
      
      <button 
        class="page-btn" 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
      <button 
        class="page-btn" 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
      >
        尾页
      </button>
    </div>
    
    <!-- 新增/编辑比赛表单 (在列表下方) -->
    <div class="form-container" v-if="showAddForm || showEditForm">
      <div class="form-header">
        <h3>{{ showEditForm ? '编辑比赛' : '新增比赛' }}</h3>
        <button class="close-form-btn" @click="closeForm">×</button>
      </div>
      
      <form @submit.prevent="submitForm" class="match-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">比赛名称 *</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              required
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="startTime">比赛开始时间 *</label>
            <input
              type="datetime-local"
              id="startTime"
              v-model="formData.startTime"
              required
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="endTime">比赛结束时间 *</label>
            <input
              type="datetime-local"
              id="endTime"
              v-model="formData.endTime"
              required
              class="form-control"
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="totalPlayers">比赛人数 *</label>
            <input
              type="number"
              id="totalPlayers"
              v-model="formData.totalPlayers"
              min="1"
              required
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="participatedPlayers">参与人数 *</label>
            <input
              type="number"
              id="participatedPlayers"
              v-model="formData.participatedPlayers"
              min="0"
              required
              class="form-control"
            >
          </div>
          
          <div class="form-group">
            <label for="refereeId">裁判ID *</label>
            <input
              type="text"
              id="refereeId"
              v-model="formData.refereeId"
              required
              class="form-control"
            >
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group full-width">
            <label for="rules">规则</label>
            <textarea
              id="rules"
              v-model="formData.rules"
              rows="3"
              class="form-control"
              placeholder="请输入比赛规则"
            ></textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeForm">取消</button>
          <button type="submit" class="submit-btn">
            {{ showEditForm ? '更新' : '新增' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 模拟比赛数据
const matches = ref([
  {
    id: 1001,
    name: '秋季篮球联赛',
    startTime: '2023-10-15T09:00',
    endTime: '2023-10-15T11:30',
    totalPlayers: 32,
    participatedPlayers: 32,
    refereeId: 'REF-2023-001',
    rules: '单循环赛制，三局两胜',
    status: 1 // 启动
  },
  {
    id: 1002,
    name: '羽毛球双打赛',
    startTime: '2023-10-15T13:00',
    endTime: '2023-10-15T15:30',
    totalPlayers: 16,
    participatedPlayers: 14,
    refereeId: 'REF-2023-002',
    rules: '淘汰赛制，一局定胜负',
    status: 0 // 禁用
  },
  {
    id: 1003,
    name: '乒乓球团体赛',
    startTime: '2023-10-16T10:00',
    endTime: '2023-10-16T12:00',
    totalPlayers: 24,
    participatedPlayers: 24,
    refereeId: 'REF-2023-003',
    rules: '分组循环，每组前两名晋级',
    status: 1 // 启动
  },
  {
    id: 1004,
    name: '春季足球友谊赛',
    startTime: '2023-10-16T14:00',
    endTime: '2023-10-16T17:00',
    totalPlayers: 8,
    participatedPlayers: 8,
    refereeId: 'REF-2023-001',
    rules: '双循环赛制，积分排名',
    status: 1 // 启动
  },
  {
    id: 1005,
    name: '排球邀请赛',
    startTime: '2023-10-17T09:30',
    endTime: '2023-10-17T12:30',
    totalPlayers: 40,
    participatedPlayers: 38,
    refereeId: 'REF-2023-004',
    rules: '单败淘汰制',
    status: 0 // 禁用
  },
  {
    id: 1006,
    name: '网球单打锦标赛',
    startTime: '2023-10-17T13:30',
    endTime: '2023-10-17T16:00',
    totalPlayers: 12,
    participatedPlayers: 12,
    refereeId: 'REF-2023-005',
    rules: '三局两胜制，循环积分',
    status: 1 // 启动
  },
  {
    id: 1001,
    name: '秋季篮球联赛',
    startTime: '2023-10-15T09:00',
    endTime: '2023-10-15T11:30',
    totalPlayers: 32,
    participatedPlayers: 32,
    refereeId: 'REF-2023-001',
    rules: '单循环赛制，三局两胜',
    status: 1 // 启动
  },
  {
    id: 1002,
    name: '羽毛球双打赛',
    startTime: '2023-10-15T13:00',
    endTime: '2023-10-15T15:30',
    totalPlayers: 16,
    participatedPlayers: 14,
    refereeId: 'REF-2023-002',
    rules: '淘汰赛制，一局定胜负',
    status: 0 // 禁用
  },
  {
    id: 1003,
    name: '乒乓球团体赛',
    startTime: '2023-10-16T10:00',
    endTime: '2023-10-16T12:00',
    totalPlayers: 24,
    participatedPlayers: 24,
    refereeId: 'REF-2023-003',
    rules: '分组循环，每组前两名晋级',
    status: 1 // 启动
  },
  {
    id: 1004,
    name: '春季足球友谊赛',
    startTime: '2023-10-16T14:00',
    endTime: '2023-10-16T17:00',
    totalPlayers: 8,
    participatedPlayers: 8,
    refereeId: 'REF-2023-001',
    rules: '双循环赛制，积分排名',
    status: 1 // 启动
  },
  {
    id: 1005,
    name: '排球邀请赛',
    startTime: '2023-10-17T09:30',
    endTime: '2023-10-17T12:30',
    totalPlayers: 40,
    participatedPlayers: 38,
    refereeId: 'REF-2023-004',
    rules: '单败淘汰制',
    status: 0 // 禁用
  },
  {
    id: 1006,
    name: '网球单打锦标赛',
    startTime: '2023-10-17T13:30',
    endTime: '2023-10-17T16:00',
    totalPlayers: 12,
    participatedPlayers: 12,
    refereeId: 'REF-2023-005',
    rules: '三局两胜制，循环积分',
    status: 1 // 启动
  }
]);

// 搜索相关变量
const searchKeyword = ref('');
const filteredMatches = computed(() => {
  if (!searchKeyword.value) {
    return matches.value;
  }
  const keyword = searchKeyword.value.toLowerCase();
  return matches.value.filter(match => 
    match.name.toLowerCase().includes(keyword)
  );
});

// 分页相关变量 - 固定每页5条数据
const currentPage = ref(1);
const pageSize = ref(5); // 固定每页5条

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredMatches.value.length / pageSize.value);
});

// 获取当前页数据
const currentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredMatches.value.slice(startIndex, startIndex + pageSize.value);
});

// 监听搜索关键词变化，重置到第一页
watch(searchKeyword, () => {
  currentPage.value = 1;
});

// 表单相关变量
const showAddForm = ref(false);
const showEditForm = ref(false);
const formData = ref({
  id: null,
  name: '',
  startTime: '',
  endTime: '',
  totalPlayers: 0,
  participatedPlayers: 0,
  refereeId: '',
  rules: ''
});

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  const options = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateTimeString).toLocaleString('zh-CN', options);
};

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑由computed属性自动处理
};

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = '';
  currentPage.value = 1;
};

// 切换新增表单显示状态
const toggleAddForm = () => {
  if (showEditForm.value) {
    closeForm();
  }
  showAddForm.value = !showAddForm.value;
  if (showAddForm.value) {
    resetFormData();
  }
};

// 打开编辑表单
const handleEdit = (match) => {
  if (showAddForm.value) {
    showAddForm.value = false;
  }
  formData.value = { ...match };
  // 转换为datetime-local所需的格式
  formData.value.startTime = new Date(match.startTime).toISOString().slice(0, 16);
  formData.value.endTime = new Date(match.endTime).toISOString().slice(0, 16);
  showEditForm.value = true;
  // 滚动到表单位置
  scrollToForm();
};

// 关闭表单
const closeForm = () => {
  showAddForm.value = false;
  showEditForm.value = false;
  resetFormData();
};

// 重置表单数据
const resetFormData = () => {
  formData.value = {
    id: null,
    name: '',
    startTime: '',
    endTime: '',
    totalPlayers: 0,
    participatedPlayers: 0,
    refereeId: '',
    rules: ''
  };
};

// 滚动到表单位置
const scrollToForm = () => {
  setTimeout(() => {
    const formElement = document.querySelector('.form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

// 处理删除
const handleDelete = (id) => {
  const match = matches.value.find(m => m.id === id);
  if (confirm(`确定要删除比赛"${match.name}"吗？`)) {
    matches.value = matches.value.filter(m => m.id !== id);
    // 如果删除后当前页没有数据且不是第一页，则跳转到上一页
    if (currentPageData.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  }
};

// 处理状态变更
const handleStatusChange = (id) => {
  const match = matches.value.find(m => m.id === id);
  if (match) {
    match.status = match.status === 1 ? 0 : 1;
    alert(`比赛"${match.name}"状态已变更为: ${match.status === 1 ? '启动' : '禁用'}`);
  }
};

// 提交表单（新增或编辑）
const submitForm = () => {
  // 简单验证结束时间是否晚于开始时间
  if (new Date(formData.value.endTime) <= new Date(formData.value.startTime)) {
    alert('比赛结束时间必须晚于开始时间');
    return;
  }
  
  // 验证参与人数不能超过比赛人数
  if (formData.value.participatedPlayers > formData.value.totalPlayers) {
    alert('参与人数不能超过比赛人数');
    return;
  }
  
  if (showEditForm.value) {
    // 编辑操作
    const index = matches.value.findIndex(m => m.id === formData.value.id);
    if (index !== -1) {
      matches.value[index] = { ...formData.value, status: matches.value[index].status };
      alert('比赛更新成功');
    }
  } else {
    // 新增操作
    const newId = Math.max(...matches.value.map(m => m.id), 1000) + 1;
    const newMatch = {
      ...formData.value,
      id: newId,
      status: 0 // 新增比赛默认为禁用状态
    };
    matches.value.unshift(newMatch); // 添加到列表开头
    alert('比赛新增成功');
  }
  
  closeForm();
  currentPage.value = 1; // 新增/编辑后回到第一页
};
</script>

<style scoped>
    @import "EventManagement.css"
</style>