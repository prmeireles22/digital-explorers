import { useState, useEffect } from 'react'
import './App.css'

// Componente principal do aplicativo
function App() {
  // Estado global do progresso
  const [currentScreen, setCurrentScreen] = useState('home') // home, mission1, mission2, mission3, badges
  const [userProfile, setUserProfile] = useState(null)
  const [completedMissions, setCompletedMissions] = useState([])
  const [badges, setBadges] = useState([])

  // Carregar progresso do localStorage ao iniciar
  useEffect(() => {
    const savedProfile = localStorage.getItem('digitalExplorersProfile')
    const savedMissions = localStorage.getItem('digitalExplorersCompletedMissions')
    const savedBadges = localStorage.getItem('digitalExplorersBadges')
    
    if (savedProfile) setUserProfile(JSON.parse(savedProfile))
    if (savedMissions) setCompletedMissions(JSON.parse(savedMissions))
    if (savedBadges) setBadges(JSON.parse(savedBadges))
  }, [])

  // Salvar progresso no localStorage
  const saveProgress = (profile, missions, badgesList) => {
    if (profile) {
      localStorage.setItem('digitalExplorersProfile', JSON.stringify(profile))
      setUserProfile(profile)
    }
    if (missions) {
      localStorage.setItem('digitalExplorersCompletedMissions', JSON.stringify(missions))
      setCompletedMissions(missions)
    }
    if (badgesList) {
      localStorage.setItem('digitalExplorersBadges', JSON.stringify(badgesList))
      setBadges(badgesList)
    }
  }

  // Resetar progresso (para testes)
  const resetProgress = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso?')) {
      localStorage.clear()
      setUserProfile(null)
      setCompletedMissions([])
      setBadges([])
      setCurrentScreen('home')
    }
  }

  // Renderizar tela apropriada
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          userProfile={userProfile}
          completedMissions={completedMissions}
          badges={badges}
          onStartMission={(mission) => setCurrentScreen(mission)}
          onViewBadges={() => setCurrentScreen('badges')}
          onReset={resetProgress}
        />
      case 'mission1':
        return <Mission1 
          onComplete={(profile) => {
            const newMissions = [...completedMissions, 'mission1']
            const newBadges = [...badges, { id: 'explorer_iniciante', name: 'Explorador Iniciante', icon: '🏕️', mission: 1 }]
            saveProgress(profile, newMissions, newBadges)
            setCurrentScreen('home')
          }}
          existingProfile={userProfile}
        />
      case 'mission2':
        return <Mission2 
          userProfile={userProfile}
          onComplete={(screenTimeData) => {
            const newMissions = [...completedMissions, 'mission2']
            const newBadges = [...badges, { id: 'mestre_tempo', name: 'Mestre do Tempo', icon: '⏰', mission: 2 }]
            const updatedProfile = { ...userProfile, screenTimeData }
            saveProgress(updatedProfile, newMissions, newBadges)
            setCurrentScreen('home')
          }}
        />
      case 'mission3':
        return <Mission3 
          userProfile={userProfile}
          onComplete={(privacyData) => {
            const newMissions = [...completedMissions, 'mission3']
            const newBadges = [...badges, { id: 'guardiao_privacidade', name: 'Guardião da Privacidade', icon: '🛡️', mission: 3 }]
            const updatedProfile = { ...userProfile, privacyData }
            saveProgress(updatedProfile, newMissions, newBadges)
            setCurrentScreen('home')
          }}
        />
      case 'badges':
        return <BadgesScreen 
          badges={badges}
          userProfile={userProfile}
          onBack={() => setCurrentScreen('home')}
        />
      default:
        return <HomeScreen 
          userProfile={userProfile}
          completedMissions={completedMissions}
          badges={badges}
          onStartMission={(mission) => setCurrentScreen(mission)}
          onViewBadges={() => setCurrentScreen('badges')}
          onReset={resetProgress}
        />
    }
  }

  return (
    <div className="App">
      {renderScreen()}
    </div>
  )
}

// ==================== TELA INICIAL ====================
function HomeScreen({ userProfile, completedMissions, badges, onStartMission, onViewBadges, onReset }) {
  const missions = [
    {
      id: 'mission1',
      number: 1.1,
      title: 'Bem-vindo, Explorador!',
      description: 'Conheça seus guias e crie seu perfil',
      icon: '🏕️',
      duration: '10-15 min',
      completed: completedMissions.includes('mission1')
    },
    {
      id: 'mission2',
      number: 1.2,
      title: 'O Relógio do Explorador',
      description: 'Descubra seu tempo de tela',
      icon: '⏰',
      duration: '10-15 min',
      completed: completedMissions.includes('mission2'),
      locked: !completedMissions.includes('mission1')
    },
    {
      id: 'mission3',
      number: 1.3,
      title: 'Escudo de Proteção',
      description: 'Aprenda sobre privacidade e senhas',
      icon: '🛡️',
      duration: '15-20 min',
      completed: completedMissions.includes('mission3'),
      locked: !completedMissions.includes('mission2')
    }
  ]

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">🌟 DIGITAL EXPLORERS</h1>
        <p className="home-subtitle">Mundo 1: Base Camp - Fundamentos Digitais</p>
        
        {userProfile && (
          <div className="user-welcome">
            <div className="user-avatar-small" style={{ backgroundColor: userProfile.color }}>
              😊
              {userProfile.accessory === 'glasses' && <span className="accessory">👓</span>}
              {userProfile.accessory === 'hat' && <span className="accessory">🎩</span>}
              {userProfile.accessory === 'backpack' && <span className="accessory">🎒</span>}
            </div>
            <div>
              <p className="welcome-text">Olá, <strong>{userProfile.name}</strong>!</p>
              <p className="badges-count">🏆 {badges.length} badges conquistados</p>
            </div>
          </div>
        )}
      </div>

      <div className="missions-container">
        <h2 className="missions-title">📍 Suas Missões</h2>
        
        <div className="missions-grid">
          {missions.map((mission) => (
            <div 
              key={mission.id}
              className={`mission-card ${mission.completed ? 'completed' : ''} ${mission.locked ? 'locked' : ''}`}
              onClick={() => !mission.locked && onStartMission(mission.id)}
            >
              <div className="mission-icon">{mission.icon}</div>
              <div className="mission-content">
                <h3 className="mission-number">Missão {mission.number}</h3>
                <h4 className="mission-title">{mission.title}</h4>
                <p className="mission-description">{mission.description}</p>
                <p className="mission-duration">⏱️ {mission.duration}</p>
              </div>
              {mission.completed && <div className="mission-check">✅</div>}
              {mission.locked && <div className="mission-lock">🔒</div>}
              {!mission.locked && !mission.completed && (
                <button className="mission-button">Começar</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="home-actions">
        {badges.length > 0 && (
          <button className="view-badges-btn" onClick={onViewBadges}>
            🏆 Ver Meus Badges
          </button>
        )}
        {userProfile && (
          <button className="reset-btn" onClick={onReset}>
            🔄 Resetar Progresso
          </button>
        )}
      </div>
    </div>
  )
}

// ==================== MISSÃO 1.1 ====================
function Mission1({ onComplete, existingProfile }) {
  const [step, setStep] = useState(existingProfile ? 'summary' : 'mascots')
  const [selectedMascot, setSelectedMascot] = useState(existingProfile?.mascot || null)
  const [ageGroup, setAgeGroup] = useState(existingProfile?.ageGroup || null)
  const [profile, setProfile] = useState(existingProfile || {
    name: '',
    color: '#9C27B0',
    accessory: 'glasses',
    pet: 'cat',
    interests: []
  })
  const [showBadge, setShowBadge] = useState(false)

  const mascots = [
    {
      id: 'byte',
      name: 'Byte',
      emoji: '🤖',
      color: '#00B8D4',
      description: 'Robozinho azul cyan, curioso e energético',
      quote: '"Olá, explorador! Eu sou o Byte! Adoro aprender coisas novas e descobrir como a tecnologia funciona. Às vezes sou um pouco impaciente e quero fazer tudo ao mesmo tempo... você também é assim?"'
    },
    {
      id: 'pixel',
      name: 'Pixel',
      emoji: '🐱',
      color: '#FF69B4',
      description: 'Gatinha rosa, criativa e empática',
      quote: '"Oi! Eu sou a Pixel! Gosto de criar coisas lindas e me conectar com amigos. Às vezes fico triste quando vejo coisas ruins online, mas estou aprendendo a lidar com isso. Vamos aprender juntos?"'
    },
    {
      id: 'data',
      name: 'Data',
      emoji: '🦉',
      color: '#CDDC39',
      description: 'Coruja verde limão, sábia e protetora',
      quote: '"Saudações, jovem explorador. Eu sou a Data. Meu trabalho é manter todos seguros e ajudar vocês a tomar decisões inteligentes. Tenho muita sabedoria para compartilhar sobre o mundo digital!"'
    }
  ]

  const handleMascotSelect = (mascot) => {
    setSelectedMascot(mascot)
    setTimeout(() => setStep('age'), 1000)
  }

  const handleAgeSelect = (age) => {
    setAgeGroup(age)
    setTimeout(() => setStep('profile'), 500)
  }

  const handleProfileComplete = () => {
    if (!profile.name.trim()) {
      alert('Por favor, digite seu nome de explorador!')
      return
    }
    setShowBadge(true)
    setTimeout(() => {
      setStep('summary')
      setShowBadge(false)
    }, 2000)
  }

  const handleFinish = () => {
    onComplete({
      ...profile,
      mascot: selectedMascot,
      ageGroup: ageGroup
    })
  }

  if (step === 'mascots') {
    return (
      <div className="mission-container">
        <div className="mission-header">
          <h1 className="mission-main-title">🏕️ MISSÃO 1.1: BEM-VINDO, EXPLORADOR!</h1>
          <p className="mission-subtitle">Conheça seus guias nesta jornada digital</p>
        </div>

        <div className="mascots-grid">
          {mascots.map((mascot) => (
            <div
              key={mascot.id}
              className={`mascot-card ${selectedMascot?.id === mascot.id ? 'selected' : ''}`}
              style={{ borderColor: mascot.color }}
              onClick={() => handleMascotSelect(mascot)}
            >
              <div className="mascot-emoji">{mascot.emoji}</div>
              <h3 className="mascot-name" style={{ color: mascot.color }}>{mascot.name}</h3>
              <p className="mascot-description">{mascot.description}</p>
              <p className="mascot-quote">{mascot.quote}</p>
            </div>
          ))}
        </div>

        <p className="instruction">👆 Escolha o mascote que mais se parece com você!</p>
      </div>
    )
  }

  if (step === 'age') {
    const ageGroups = [
      { id: '5-7', label: '5-7 anos' },
      { id: '8-10', label: '8-10 anos' },
      { id: '11-13', label: '11-13 anos' },
      { id: '14-15', label: '14-15 anos' }
    ]

    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: selectedMascot.color }}>
          {selectedMascot.emoji} {selectedMascot.name}
        </div>

        <h2 className="step-title">Qual é a sua idade?</h2>
        <p className="step-subtitle">Isso nos ajuda a personalizar sua aventura!</p>

        <div className="age-grid">
          {ageGroups.map((age) => (
            <button
              key={age.id}
              className="age-button"
              onClick={() => handleAgeSelect(age.id)}
            >
              {age.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'profile') {
    const colors = ['#9C27B0', '#00B8D4', '#FF69B4', '#FFFF00', '#CDDC39', '#FF5722']
    const accessories = [
      { id: 'glasses', label: '👓 Óculos' },
      { id: 'hat', label: '🎩 Chapéu' },
      { id: 'backpack', label: '🎒 Mochila' }
    ]
    const pets = [
      { id: 'cat', label: '🐱 Gato' },
      { id: 'dog', label: '🐶 Cachorro' },
      { id: 'dragon', label: '🐉 Dragão' }
    ]
    const interestOptions = [
      'Ficar mais seguro online',
      'Usar menos tempo de tela',
      'Fazer amigos online com segurança',
      'Criar coisas legais com tecnologia',
      'Entender como redes sociais funcionam',
      'Aprender sobre IA e tecnologia'
    ]

    return (
      <div className="mission-container profile-creation">
        <div className="mascot-badge" style={{ backgroundColor: selectedMascot.color }}>
          {selectedMascot.emoji} {selectedMascot.name}
        </div>

        <h2 className="step-title">Crie seu Perfil de Explorador!</h2>
        <p className="step-subtitle">Personalize seu avatar e escolha seus objetivos</p>

        <div className="avatar-preview" style={{ backgroundColor: profile.color }}>
          😊
          {profile.accessory === 'glasses' && <span className="accessory">👓</span>}
          {profile.accessory === 'hat' && <span className="accessory">🎩</span>}
          {profile.accessory === 'backpack' && <span className="accessory">🎒</span>}
        </div>

        <div className="profile-form">
          <label>Nome de Explorador:</label>
          <input
            type="text"
            placeholder="Digite seu nome ou apelido"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />

          <label>Cor Favorita:</label>
          <div className="color-picker">
            {colors.map((color) => (
              <button
                key={color}
                className={`color-option ${profile.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setProfile({ ...profile, color })}
              />
            ))}
          </div>

          <label>Acessório Especial:</label>
          <div className="options-grid">
            {accessories.map((acc) => (
              <button
                key={acc.id}
                className={`option-button ${profile.accessory === acc.id ? 'selected' : ''}`}
                onClick={() => setProfile({ ...profile, accessory: acc.id })}
              >
                {acc.label}
              </button>
            ))}
          </div>

          <label>Pet Digital:</label>
          <div className="options-grid">
            {pets.map((pet) => (
              <button
                key={pet.id}
                className={`option-button ${profile.pet === pet.id ? 'selected' : ''}`}
                onClick={() => setProfile({ ...profile, pet: pet.id })}
              >
                {pet.label}
              </button>
            ))}
          </div>

          <label>O que você quer aprender? (escolha quantos quiser)</label>
          <div className="interests-list">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                className={`interest-button ${profile.interests.includes(interest) ? 'selected' : ''}`}
                onClick={() => {
                  const newInterests = profile.interests.includes(interest)
                    ? profile.interests.filter(i => i !== interest)
                    : [...profile.interests, interest]
                  setProfile({ ...profile, interests: newInterests })
                }}
              >
                {profile.interests.includes(interest) ? '✅' : '⬜'} {interest}
              </button>
            ))}
          </div>

          <button className="complete-button" onClick={handleProfileComplete}>
            Finalizar Perfil 🚀
          </button>
        </div>
      </div>
    )
  }

  if (showBadge) {
    return (
      <div className="badge-overlay">
        <div className="badge-card">
          <div className="badge-icon rotating">🏕️</div>
          <h2 className="badge-title">BADGE CONQUISTADO!</h2>
          <p className="badge-name">Explorador Iniciante</p>
        </div>
      </div>
    )
  }

  if (step === 'summary') {
    const mascot = mascots.find(m => m.id === selectedMascot.id)
    
    return (
      <div className="mission-container summary-screen">
        <h1 className="congrats-title">🎉 Parabéns, {profile.name}!</h1>
        <p className="congrats-subtitle">Você completou a Missão 1.1!</p>

        <div className="summary-card">
          <div className="avatar-preview" style={{ backgroundColor: profile.color }}>
            😊
            {profile.accessory === 'glasses' && <span className="accessory">👓</span>}
            {profile.accessory === 'hat' && <span className="accessory">🎩</span>}
            {profile.accessory === 'backpack' && <span className="accessory">🎒</span>}
          </div>
          <h3>{profile.name}</h3>
          <p>Mascote Favorito: {mascot.emoji} {mascot.name}</p>
          <p>Idade: {ageGroup} anos</p>
          <p>Pet: {profile.pet === 'cat' ? '🐱' : profile.pet === 'dog' ? '🐶' : '🐉'}</p>
        </div>

        <div className="badge-earned">
          <div className="badge-icon">🏕️</div>
          <div>
            <h4>Explorador Iniciante</h4>
            <p>Primeira missão completa!</p>
          </div>
        </div>

        {profile.interests.length > 0 && (
          <div className="objectives-section">
            <h3>Seus Objetivos:</h3>
            {profile.interests.map((interest, i) => (
              <p key={i}>✨ {interest}</p>
            ))}
          </div>
        )}

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <p><strong>{mascot.name}:</strong> "Incrível, {profile.name}! Você está pronto para a próxima missão. Vamos explorar juntos o Relógio do Explorador e aprender sobre tempo de tela!"</p>
        </div>

        <button className="next-mission-button" onClick={handleFinish}>
          Voltar ao Mapa de Missões 🗺️
        </button>
      </div>
    )
  }
}

// ==================== MISSÃO 1.2 ====================
function Mission2({ userProfile, onComplete }) {
  const [step, setStep] = useState('intro')
  const [estimatedTime, setEstimatedTime] = useState(null)
  const [actualTime, setActualTime] = useState(null)
  const [reflection, setReflection] = useState('')
  const [goal, setGoal] = useState('')
  const [showBadge, setShowBadge] = useState(false)

  const mascot = userProfile?.mascot || { id: 'byte', emoji: '🤖', name: 'Byte', color: '#00B8D4' }

  const handleEstimate = (hours) => {
    setEstimatedTime(hours)
    setTimeout(() => setStep('check'), 500)
  }

  const handleActualTime = (hours) => {
    setActualTime(hours)
    setTimeout(() => setStep('comparison'), 500)
  }

  const handleReflection = () => {
    setShowBadge(true)
    setTimeout(() => {
      setStep('summary')
      setShowBadge(false)
    }, 2000)
  }

  const handleFinish = () => {
    onComplete({
      estimatedTime,
      actualTime,
      reflection,
      goal
    })
  }

  if (step === 'intro') {
    return (
      <div className="mission-container">
        <div className="mission-header">
          <h1 className="mission-main-title">⏰ MISSÃO 1.2: O RELÓGIO DO EXPLORADOR</h1>
          <p className="mission-subtitle">Descubra quanto tempo você passa nas telas</p>
        </div>

        <div className="mascot-message large" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji-large">{mascot.emoji}</span>
          <div>
            <p><strong>{mascot.name}:</strong></p>
            <p>"Olá, {userProfile.name}! Você sabe quanto tempo passa usando celular, tablet ou computador por dia? A maioria das pessoas não sabe! Vamos descobrir juntos?"</p>
          </div>
        </div>

        <div className="info-card">
          <h3>🎯 O que vamos fazer:</h3>
          <p>1️⃣ Você vai adivinhar quanto tempo usa telas por dia</p>
          <p>2️⃣ Vamos verificar o tempo real (com ajuda de um adulto)</p>
          <p>3️⃣ Comparar e refletir sem julgamento</p>
          <p>4️⃣ Definir um objetivo pessoal (se quiser)</p>
        </div>

        <button className="continue-button" onClick={() => setStep('estimate')}>
          Vamos Começar! 🚀
        </button>
      </div>
    )
  }

  if (step === 'estimate') {
    const timeOptions = [
      { value: 1, label: 'Menos de 1 hora', emoji: '😌' },
      { value: 2, label: '1-2 horas', emoji: '😊' },
      { value: 3, label: '2-3 horas', emoji: '🤔' },
      { value: 4, label: '3-4 horas', emoji: '😅' },
      { value: 5, label: '4-5 horas', emoji: '😰' },
      { value: 6, label: 'Mais de 5 horas', emoji: '😱' }
    ]

    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">Quanto tempo você ACHA que usa telas por dia?</h2>
        <p className="step-subtitle">Não precisa ser exato, é só um palpite!</p>

        <div className="time-options">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              className="time-option-button"
              onClick={() => handleEstimate(option.value)}
            >
              <span className="time-emoji">{option.emoji}</span>
              <span className="time-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'check') {
    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">Agora vamos verificar o tempo REAL!</h2>
        
        <div className="info-card">
          <h3>📱 Como verificar:</h3>
          <p><strong>iPhone/iPad:</strong></p>
          <p>Configurações → Tempo de Uso → Ver Toda Atividade</p>
          <br/>
          <p><strong>Android:</strong></p>
          <p>Configurações → Bem-estar Digital → Painel</p>
          <br/>
          <p><strong>💡 Dica:</strong> Peça ajuda de um adulto se precisar!</p>
        </div>

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <p>"Olhe o tempo de ONTEM (não de hoje, porque o dia ainda não acabou). Anote o número total de horas!"</p>
        </div>

        <button className="continue-button" onClick={() => setStep('actual')}>
          Já Verifiquei! ✅
        </button>
      </div>
    )
  }

  if (step === 'actual') {
    const timeOptions = [
      { value: 1, label: 'Menos de 1 hora' },
      { value: 2, label: '1-2 horas' },
      { value: 3, label: '2-3 horas' },
      { value: 4, label: '3-4 horas' },
      { value: 5, label: '4-5 horas' },
      { value: 6, label: '5-6 horas' },
      { value: 7, label: '6-7 horas' },
      { value: 8, label: 'Mais de 7 horas' }
    ]

    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">Quanto tempo você REALMENTE usou ontem?</h2>
        <p className="step-subtitle">Escolha a opção mais próxima do que você viu</p>

        <div className="time-options">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              className="time-option-button simple"
              onClick={() => handleActualTime(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'comparison') {
    const difference = Math.abs(actualTime - estimatedTime)
    const wasAccurate = difference <= 1
    const overestimated = estimatedTime > actualTime
    const underestimated = estimatedTime < actualTime

    const getTimeLabel = (value) => {
      if (value <= 1) return 'menos de 1 hora'
      if (value === 2) return '1-2 horas'
      if (value === 3) return '2-3 horas'
      if (value === 4) return '3-4 horas'
      if (value === 5) return '4-5 horas'
      if (value === 6) return '5-6 horas'
      if (value === 7) return '6-7 horas'
      return 'mais de 7 horas'
    }

    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">📊 Comparação dos Tempos</h2>

        <div className="comparison-cards">
          <div className="comparison-card">
            <h3>Você achou que usava:</h3>
            <p className="time-big">{getTimeLabel(estimatedTime)}</p>
          </div>
          <div className="comparison-arrow">→</div>
          <div className="comparison-card">
            <h3>Você realmente usou:</h3>
            <p className="time-big">{getTimeLabel(actualTime)}</p>
          </div>
        </div>

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <div>
            {wasAccurate && <p>"Uau! Você conhece bem seus hábitos! Seu palpite foi muito próximo da realidade. 🎯"</p>}
            {overestimated && <p>"Interessante! Você achava que usava mais do que realmente usa. Às vezes nos sentimos como se passássemos muito tempo nas telas, mas não é tanto quanto parece!"</p>}
            {underestimated && <p>"Surpreso? Muitas pessoas subestimam o tempo de tela. O tempo passa rápido quando estamos entretidos! Mas não se preocupe, não há problema nisso - o importante é ter consciência."</p>}
          </div>
        </div>

        <button className="continue-button" onClick={() => setStep('reflection')}>
          Continuar para Reflexão 💭
        </button>
      </div>
    )
  }

  if (step === 'reflection') {
    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">💭 Momento de Reflexão</h2>
        <p className="step-subtitle">Não há respostas certas ou erradas!</p>

        <div className="reflection-questions">
          <div className="question-card">
            <h3>Como você se sente sobre o tempo que descobriu?</h3>
            <div className="feeling-options">
              <button className="feeling-button" onClick={() => setReflection('surprised')}>
                😲 Surpreso
              </button>
              <button className="feeling-button" onClick={() => setReflection('expected')}>
                😌 Era o que esperava
              </button>
              <button className="feeling-button" onClick={() => setReflection('worried')}>
                😰 Preocupado
              </button>
              <button className="feeling-button" onClick={() => setReflection('happy')}>
                😊 Feliz com isso
              </button>
            </div>
          </div>

          {reflection && (
            <div className="question-card">
              <h3>Você quer definir um objetivo pessoal?</h3>
              <p className="small-text">Isso é totalmente opcional!</p>
              <div className="goal-options">
                <button className="goal-button" onClick={() => { setGoal('reduce'); handleReflection(); }}>
                  📉 Quero reduzir meu tempo de tela
                </button>
                <button className="goal-button" onClick={() => { setGoal('maintain'); handleReflection(); }}>
                  ✅ Está bom assim, quero manter
                </button>
                <button className="goal-button" onClick={() => { setGoal('active'); handleReflection(); }}>
                  🎨 Quero mais tempo de tela ATIVO (criar, não só consumir)
                </button>
                <button className="goal-button" onClick={() => { setGoal('none'); handleReflection(); }}>
                  🤷 Não quero definir objetivo agora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (showBadge) {
    return (
      <div className="badge-overlay">
        <div className="badge-card">
          <div className="badge-icon rotating">⏰</div>
          <h2 className="badge-title">BADGE CONQUISTADO!</h2>
          <p className="badge-name">Mestre do Tempo</p>
        </div>
      </div>
    )
  }

  if (step === 'summary') {
    return (
      <div className="mission-container summary-screen">
        <h1 className="congrats-title">🎉 Missão 1.2 Completa!</h1>
        <p className="congrats-subtitle">Você ganhou consciência sobre seu tempo de tela!</p>

        <div className="badge-earned">
          <div className="badge-icon">⏰</div>
          <div>
            <h4>Mestre do Tempo</h4>
            <p>Você conhece seus hábitos digitais!</p>
          </div>
        </div>

        <div className="summary-insights">
          <h3>📊 Suas Descobertas:</h3>
          <p>• Estimativa: {estimatedTime <= 1 ? 'menos de 1 hora' : `${estimatedTime-1}-${estimatedTime} horas`}</p>
          <p>• Tempo real: {actualTime <= 1 ? 'menos de 1 hora' : `${actualTime-1}-${actualTime} horas`}</p>
          {goal && goal !== 'none' && (
            <p>• Objetivo: {
              goal === 'reduce' ? 'Reduzir tempo de tela' :
              goal === 'maintain' ? 'Manter tempo atual' :
              'Mais tempo de tela ativo'
            }</p>
          )}
        </div>

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <p><strong>{mascot.name}:</strong> "Parabéns, {userProfile.name}! Conhecer seus hábitos é o primeiro passo para ter uma relação saudável com tecnologia. Agora você está pronto para a Missão 1.3: Escudo de Proteção!"</p>
        </div>

        <button className="next-mission-button" onClick={handleFinish}>
          Voltar ao Mapa de Missões 🗺️
        </button>
      </div>
    )
  }
}

// ==================== MISSÃO 1.3 ====================
function Mission3({ userProfile, onComplete }) {
  const [step, setStep] = useState('intro')
  const [quizScore, setQuizScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [createdPassword, setCreatedPassword] = useState('')
  const [showBadge, setShowBadge] = useState(false)

  const mascot = userProfile?.mascot || { id: 'data', emoji: '🦉', name: 'Data', color: '#CDDC39' }

  const quizQuestions = [
    {
      question: 'É seguro compartilhar seu endereço completo em redes sociais?',
      options: ['Sim, sempre', 'Não, nunca', 'Só com amigos'],
      correct: 1,
      explanation: 'Nunca compartilhe seu endereço completo online! Mesmo em perfis "privados", essa informação pode ser vista por pessoas que você não conhece.'
    },
    {
      question: 'Qual dessas senhas é mais forte?',
      options: ['123456', 'MeuNome2024', 'P@ssw0rd!2024#Forte'],
      correct: 2,
      explanation: 'Senhas fortes têm pelo menos 12 caracteres, misturam letras maiúsculas e minúsculas, números e símbolos!'
    },
    {
      question: 'Você pode compartilhar sua senha com seu melhor amigo?',
      options: ['Sim, ele é confiável', 'Não, senhas são pessoais', 'Só se ele prometer não contar'],
      correct: 1,
      explanation: 'Senhas são como escovas de dente: pessoais e intransferíveis! Nem seu melhor amigo deve saber sua senha.'
    },
    {
      question: 'O que fazer se alguém desconhecido te manda mensagem pedindo informações pessoais?',
      options: ['Responder educadamente', 'Ignorar e contar para um adulto', 'Dar informações falsas'],
      correct: 1,
      explanation: 'Sempre ignore mensagens suspeitas e conte para um adulto confiável! Nunca responda, nem com informações falsas.'
    },
    {
      question: 'É seguro usar a mesma senha para todas as suas contas?',
      options: ['Sim, é mais fácil de lembrar', 'Não, cada conta deve ter senha diferente', 'Só se for uma senha forte'],
      correct: 1,
      explanation: 'Se alguém descobrir uma senha que você usa em tudo, terá acesso a TODAS as suas contas! Use senhas diferentes.'
    }
  ]

  const handleQuizAnswer = (answerIndex) => {
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1)
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1500)
    } else {
      setTimeout(() => setStep('password'), 2000)
    }
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
    return strength
  }

  const handlePasswordChange = (password) => {
    setCreatedPassword(password)
    setPasswordStrength(checkPasswordStrength(password))
  }

  const handlePasswordComplete = () => {
    if (passwordStrength < 3) {
      alert('Tente criar uma senha mais forte! Dica: use pelo menos 12 caracteres, letras maiúsculas e minúsculas, números e símbolos.')
      return
    }
    setShowBadge(true)
    setTimeout(() => {
      setStep('summary')
      setShowBadge(false)
    }, 2000)
  }

  const handleFinish = () => {
    onComplete({
      quizScore,
      passwordStrength
    })
  }

  if (step === 'intro') {
    return (
      <div className="mission-container">
        <div className="mission-header">
          <h1 className="mission-main-title">🛡️ MISSÃO 1.3: ESCUDO DE PROTEÇÃO</h1>
          <p className="mission-subtitle">Aprenda a proteger sua privacidade e criar senhas fortes</p>
        </div>

        <div className="mascot-message large" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji-large">{mascot.emoji}</span>
          <div>
            <p><strong>{mascot.name}:</strong></p>
            <p>"Saudações, {userProfile.name}! Privacidade é como um escudo que protege suas informações pessoais. Hoje você vai aprender a criar um escudo forte e impenetrável!"</p>
          </div>
        </div>

        <div className="info-card">
          <h3>🎯 O que vamos fazer:</h3>
          <p>1️⃣ Entender o que é privacidade online</p>
          <p>2️⃣ Aprender o que NUNCA compartilhar</p>
          <p>3️⃣ Jogar quiz de segurança</p>
          <p>4️⃣ Criar uma senha super forte</p>
        </div>

        <div className="analogy-card">
          <h3>🏠 Analogia da Casa</h3>
          <p>Privacidade é como sua casa:</p>
          <p><strong>🌳 Jardim (Público):</strong> Todos podem ver - nome, foto de perfil</p>
          <p><strong>🛋️ Sala (Semi-privado):</strong> Só amigos - posts, fotos com amigos</p>
          <p><strong>🚪 Quarto (Privado):</strong> Só você - senhas, endereço, telefone</p>
        </div>

        <button className="continue-button" onClick={() => setStep('quiz')}>
          Começar Quiz de Segurança 🎮
        </button>
      </div>
    )
  }

  if (step === 'quiz') {
    const question = quizQuestions[currentQuestion]
    
    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <div className="quiz-progress">
          Pergunta {currentQuestion + 1} de {quizQuestions.length}
        </div>

        <h2 className="quiz-question">{question.question}</h2>

        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="quiz-option-button"
              onClick={() => handleQuizAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="quiz-score">
          Pontuação: {quizScore} / {currentQuestion}
        </div>
      </div>
    )
  }

  if (step === 'password') {
    return (
      <div className="mission-container">
        <div className="mascot-badge" style={{ backgroundColor: mascot.color }}>
          {mascot.emoji} {mascot.name}
        </div>

        <h2 className="step-title">🔐 Crie uma Senha Super Forte!</h2>
        <p className="step-subtitle">Sua senha é a chave da sua casa digital</p>

        <div className="password-tips">
          <h3>✅ Senha Forte tem:</h3>
          <p className={passwordStrength >= 2 ? 'tip-complete' : ''}>• Pelo menos 12 caracteres</p>
          <p className={passwordStrength >= 3 ? 'tip-complete' : ''}>• Letras maiúsculas E minúsculas</p>
          <p className={passwordStrength >= 4 ? 'tip-complete' : ''}>• Números</p>
          <p className={passwordStrength >= 5 ? 'tip-complete' : ''}>• Símbolos (!@#$%^&*)</p>
        </div>

        <div className="password-creator">
          <label>Digite sua senha forte:</label>
          <input
            type="text"
            placeholder="Ex: M1nh@S3nh@F0rt3!2024"
            value={createdPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="password-input"
          />
          
          <div className="password-strength">
            <div className="strength-label">Força da senha:</div>
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`strength-bar ${passwordStrength >= level ? 'active' : ''} ${
                    passwordStrength >= 4 ? 'strong' : passwordStrength >= 2 ? 'medium' : 'weak'
                  }`}
                />
              ))}
            </div>
            <div className="strength-text">
              {passwordStrength === 0 && 'Muito fraca'}
              {passwordStrength === 1 && 'Fraca'}
              {passwordStrength === 2 && 'Razoável'}
              {passwordStrength === 3 && 'Boa'}
              {passwordStrength === 4 && 'Forte'}
              {passwordStrength === 5 && 'Muito forte! 💪'}
            </div>
          </div>
        </div>

        <div className="password-method">
          <h3>💡 Método da Frase Secreta:</h3>
          <p>Pense em uma frase que só você sabe:</p>
          <p className="example">"Eu amo pizza de chocolate às 3 da tarde!"</p>
          <p>Transforme em senha:</p>
          <p className="example-password">E@mPizCh0c@3dT!</p>
        </div>

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <p>"Lembre-se: NUNCA compartilhe sua senha com ninguém, nem com seu melhor amigo! Senhas são pessoais como escovas de dente. 🪥"</p>
        </div>

        <button 
          className="continue-button"
          onClick={handlePasswordComplete}
          disabled={passwordStrength < 3}
        >
          Finalizar Missão 🎯
        </button>
      </div>
    )
  }

  if (showBadge) {
    return (
      <div className="badge-overlay">
        <div className="badge-card">
          <div className="badge-icon rotating">🛡️</div>
          <h2 className="badge-title">BADGE CONQUISTADO!</h2>
          <p className="badge-name">Guardião da Privacidade</p>
        </div>
      </div>
    )
  }

  if (step === 'summary') {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100)
    
    return (
      <div className="mission-container summary-screen">
        <h1 className="congrats-title">🎉 Missão 1.3 Completa!</h1>
        <p className="congrats-subtitle">Você é agora um Guardião da Privacidade!</p>

        <div className="badge-earned">
          <div className="badge-icon">🛡️</div>
          <div>
            <h4>Guardião da Privacidade</h4>
            <p>Você sabe proteger suas informações!</p>
          </div>
        </div>

        <div className="summary-insights">
          <h3>📊 Seus Resultados:</h3>
          <p>• Quiz de Segurança: {quizScore}/{quizQuestions.length} ({percentage}%)</p>
          <p>• Força da Senha: {passwordStrength}/5 {passwordStrength >= 4 ? '💪' : ''}</p>
        </div>

        <div className="key-learnings">
          <h3>🔑 Aprendizados Principais:</h3>
          <p>✅ Nunca compartilhe informações pessoais online</p>
          <p>✅ Senhas fortes têm 12+ caracteres variados</p>
          <p>✅ Cada conta deve ter senha diferente</p>
          <p>✅ Senhas são pessoais e intransferíveis</p>
        </div>

        <div className="mascot-message" style={{ borderColor: mascot.color }}>
          <span className="mascot-emoji">{mascot.emoji}</span>
          <p><strong>{mascot.name}:</strong> "Excelente trabalho, {userProfile.name}! Você completou as 3 primeiras missões do Base Camp. Continue explorando e aprendendo sobre o mundo digital com segurança!"</p>
        </div>

        <button className="next-mission-button" onClick={handleFinish}>
          Voltar ao Mapa de Missões 🗺️
        </button>
      </div>
    )
  }
}

// ==================== TELA DE BADGES ====================
function BadgesScreen({ badges, userProfile, onBack }) {
  return (
    <div className="badges-screen">
      <div className="badges-header">
        <button className="back-button" onClick={onBack}>← Voltar</button>
        <h1 className="badges-title">🏆 Meus Badges</h1>
        <p className="badges-subtitle">Conquistas do {userProfile?.name || 'Explorador'}</p>
      </div>

      <div className="badges-collection">
        {badges.length === 0 ? (
          <div className="no-badges">
            <p>Você ainda não conquistou nenhum badge.</p>
            <p>Complete as missões para ganhar recompensas!</p>
          </div>
        ) : (
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-icon-large">{badge.icon}</div>
                <h3 className="badge-name">{badge.name}</h3>
                <p className="badge-mission">Missão 1.{badge.mission}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="badges-stats">
        <h3>📊 Estatísticas</h3>
        <p>Total de badges: {badges.length}</p>
        <p>Missões completadas: {badges.length}</p>
        <p>Progresso no Mundo 1: {Math.round((badges.length / 8) * 100)}%</p>
      </div>
    </div>
  )
}

export default App

