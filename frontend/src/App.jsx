import { useCallback, useEffect, useState } from 'react'
import { catalog } from './api'
import EquityChart from './components/EquityChart'
import { dateBR, money, percent } from './format'

const emptySeries = { name: '', symbol: '', description: '' }
const emptyStrategy = {
  name: '',
  kind: 'buy_hold',
  initial_capital: '1000',
  monthly_contribution: '0',
}
const emptyPoint = { day: '', price: '' }
const demoPrices = [
  ['2026-01-05', '100'],
  ['2026-01-20', '94'],
  ['2026-02-03', '103'],
  ['2026-02-20', '98'],
  ['2026-03-03', '110'],
  ['2026-03-20', '115'],
]

export default function App() {
  const [page, setPage] = useState('overview')
  const [series, setSeries] = useState([])
  const [strategies, setStrategies] = useState([])
  const [simulations, setSimulations] = useState([])
  const [selectedSeries, setSelectedSeries] = useState(null)
  const [selectedSimulation, setSelectedSimulation] = useState(null)
  const [seriesForm, setSeriesForm] = useState(emptySeries)
  const [seriesEditId, setSeriesEditId] = useState(null)
  const [strategyForm, setStrategyForm] = useState(emptyStrategy)
  const [strategyEditId, setStrategyEditId] = useState(null)
  const [pointForm, setPointForm] = useState(emptyPoint)
  const [simulationForm, setSimulationForm] = useState({
    series_id: '',
    strategy_id: '',
    start_date: '',
    end_date: '',
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [nextSeries, nextStrategies, nextSimulations] = await Promise.all([
      catalog.series(),
      catalog.strategies(),
      catalog.simulations(),
    ])
    setSeries(nextSeries)
    setStrategies(nextStrategies)
    setSimulations(nextSimulations)
    setSelectedSeries((old) =>
      nextSeries.find((item) => item.id === old)
        ? old
        : (nextSeries[0]?.id ?? null),
    )
    setSelectedSimulation((old) =>
      nextSimulations.find((item) => item.id === old)
        ? old
        : (nextSimulations[0]?.id ?? null),
    )
    setSimulationForm((old) => ({
      ...old,
      series_id: nextSeries.some(
        (item) => String(item.id) === String(old.series_id),
      )
        ? old.series_id
        : (nextSeries[0]?.id ?? ''),
      strategy_id: nextStrategies.some(
        (item) => String(item.id) === String(old.strategy_id),
      )
        ? old.strategy_id
        : (nextStrategies[0]?.id ?? ''),
    }))
  }, [])

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [load])

  async function action(operation, success) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await operation()
      await load()
      setNotice(success)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function saveSeries(event) {
    event.preventDefault()
    action(
      async () => {
        const item = await catalog.saveSeries(seriesForm, seriesEditId)
        setSelectedSeries(item.id)
        setSeriesForm(emptySeries)
        setSeriesEditId(null)
      },
      seriesEditId ? 'Série atualizada.' : 'Série cadastrada.',
    )
  }

  function savePoint(event) {
    event.preventDefault()
    action(async () => {
      await catalog.addPoint(selectedSeries, pointForm)
      setPointForm(emptyPoint)
    }, 'Cotação adicionada.')
  }

  function saveStrategy(event) {
    event.preventDefault()
    action(
      async () => {
        await catalog.saveStrategy(strategyForm, strategyEditId)
        setStrategyForm(emptyStrategy)
        setStrategyEditId(null)
      },
      strategyEditId ? 'Estratégia atualizada.' : 'Estratégia cadastrada.',
    )
  }

  function simulate(event) {
    event.preventDefault()
    action(async () => {
      const result = await catalog.simulate({
        ...simulationForm,
        series_id: Number(simulationForm.series_id),
        strategy_id: Number(simulationForm.strategy_id),
      })
      setSelectedSimulation(result.id)
      setPage('overview')
    }, 'Simulação calculada e salva.')
  }

  function createDemo() {
    action(async () => {
      const symbol = `DEMO${Date.now().toString().slice(-7)}`
      const item = await catalog.saveSeries({
        name: 'Ativo de demonstração',
        symbol,
        description:
          'Dados fictícios para explorar a aplicação; não representam preços reais.',
      })
      for (const [day, price] of demoPrices)
        await catalog.addPoint(item.id, { day, price })
      const strategy = await catalog.saveStrategy({
        name: 'Aporte mensal de exemplo',
        kind: 'monthly_dca',
        initial_capital: '1000',
        monthly_contribution: '200',
      })
      setSelectedSeries(item.id)
      setSimulationForm({
        series_id: item.id,
        strategy_id: strategy.id,
        start_date: '2026-01-05',
        end_date: '2026-03-20',
      })
      setPage('simulate')
    }, 'Exemplo fictício preparado. Execute uma simulação para comparar.')
  }

  const currentSeries = series.find((item) => item.id === selectedSeries)
  const currentSimulation = simulations.find(
    (item) => item.id === selectedSimulation,
  )
  const comparable = simulations.filter(
    (item) =>
      currentSimulation &&
      item.series_id === currentSimulation.series_id &&
      item.start_date === currentSimulation.start_date &&
      item.end_date === currentSimulation.end_date,
  )
  const nav = [
    ['overview', 'Visão geral', '◫'],
    ['series', 'Séries de preços', '↗'],
    ['strategies', 'Estratégias', '◈'],
    ['simulate', 'Nova simulação', '⊞'],
  ]

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            S<span>↗</span>
          </div>
          <div>
            <strong>
              strategy<span>lab</span>
            </strong>
            <small>INVESTMENT RESEARCH</small>
          </div>
        </div>
        <div className="menu-label">WORKSPACE</div>
        <nav aria-label="Navegação principal">
          {nav.map(([key, label, icon]) => (
            <button
              key={key}
              type="button"
              className={`nav-item ${page === key ? 'active' : ''}`}
              onClick={() => setPage(key)}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span className="online-dot" /> Simulação local{' '}
          <small>Dados e resultados persistidos</small>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span>
            Laboratório /{' '}
            <strong>{nav.find(([key]) => key === page)?.[1]}</strong>
          </span>
          <span className="tag">C216 · Projeto Final</span>
        </header>
        {error && (
          <div role="alert" className="message error">
            {error}
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Fechar erro"
            >
              ×
            </button>
          </div>
        )}
        {notice && (
          <div role="status" className="message success">
            {notice}
            <button
              type="button"
              onClick={() => setNotice('')}
              aria-label="Fechar aviso"
            >
              ×
            </button>
          </div>
        )}
        {loading ? (
          <div role="status" className="loading">
            Carregando dados...
          </div>
        ) : (
          <div className="content">
            {page === 'overview' && (
              <>
                <div className="hero">
                  <div>
                    <div className="eyebrow">PESQUISA DE INVESTIMENTOS</div>
                    <h1>
                      Compare decisões.
                      <br />
                      <em>Entenda resultados.</em>
                    </h1>
                    <p>
                      Teste estratégias sobre a mesma série histórica e analise
                      os resultados com critérios transparentes.
                    </p>
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="primary"
                        onClick={() => setPage('simulate')}
                      >
                        Nova simulação <span>↗</span>
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        disabled={busy}
                        onClick={createDemo}
                      >
                        Criar dados de exemplo
                      </button>
                    </div>
                  </div>
                  <div className="hero-art" aria-hidden="true">
                    <span className="art-grid" />
                    <span className="art-line">╱╲╱╲╱╲╱</span>
                    <span className="art-circle">↗</span>
                  </div>
                </div>
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">SEU LABORATÓRIO</span>
                    <h2>Painel de análise</h2>
                  </div>
                  <span className="muted">
                    {simulations.length} simulação(ões) salvas
                  </span>
                </div>
                <div className="stats">
                  <div className="stat">
                    <span>Séries cadastradas</span>
                    <strong>{series.length}</strong>
                    <small>Ativos disponíveis</small>
                  </div>
                  <div className="stat">
                    <span>Estratégias</span>
                    <strong>{strategies.length}</strong>
                    <small>Regras de alocação</small>
                  </div>
                  <div className="stat">
                    <span>Simulações</span>
                    <strong>{simulations.length}</strong>
                    <small>Resultados persistidos</small>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Resultados salvos</h3>
                      <p>
                        Selecione uma execução para examinar o patrimônio e o
                        risco.
                      </p>
                    </div>
                  </div>
                  {simulations.length === 0 ? (
                    <div className="empty">
                      Nenhuma simulação ainda. Cadastre uma série e uma
                      estratégia, ou crie os dados de exemplo.
                    </div>
                  ) : (
                    <>
                      <div className="result-list">
                        {simulations.map((result) => (
                          <button
                            type="button"
                            key={result.id}
                            className={`result-row ${selectedSimulation === result.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSimulation(result.id)}
                          >
                            <span>
                              <strong>
                                {strategies.find(
                                  (item) => item.id === result.strategy_id,
                                )?.name || `Estratégia #${result.strategy_id}`}
                              </strong>
                              <small>
                                {series.find(
                                  (item) => item.id === result.series_id,
                                )?.symbol || `Série #${result.series_id}`}{' '}
                                · {dateBR(result.start_date)} —{' '}
                                {dateBR(result.end_date)}
                              </small>
                            </span>
                            <span
                              className={
                                Number(result.return_pct) >= 0
                                  ? 'positive'
                                  : 'negative'
                              }
                            >
                              {percent(result.return_pct)}
                            </span>
                          </button>
                        ))}
                      </div>
                      {comparable.length > 1 && (
                        <div className="comparison">
                          <h3>Comparação no mesmo ativo e período</h3>
                          <div className="table-wrap">
                            <table>
                              <thead>
                                <tr>
                                  <th>Estratégia</th>
                                  <th>Aportado</th>
                                  <th>Valor final</th>
                                  <th>Retorno</th>
                                  <th>Queda máxima</th>
                                </tr>
                              </thead>
                              <tbody>
                                {comparable.map((item) => (
                                  <tr key={item.id}>
                                    <td>
                                      {strategies.find(
                                        (strategy) =>
                                          strategy.id === item.strategy_id,
                                      )?.name ||
                                        `Estratégia #${item.strategy_id}`}
                                    </td>
                                    <td>{money(item.invested)}</td>
                                    <td>{money(item.final_value)}</td>
                                    <td>{percent(item.return_pct)}</td>
                                    <td>{percent(item.max_drawdown_pct)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {currentSimulation && (
                        <div className="detail">
                          <div className="metric-grid">
                            <div>
                              <small>Valor final</small>
                              <strong>
                                {money(currentSimulation.final_value)}
                              </strong>
                            </div>
                            <div>
                              <small>Total aportado</small>
                              <strong>
                                {money(currentSimulation.invested)}
                              </strong>
                            </div>
                            <div>
                              <small>Retorno sobre aportes</small>
                              <strong>
                                {percent(currentSimulation.return_pct)}
                              </strong>
                            </div>
                            <div>
                              <small>Queda máxima¹</small>
                              <strong>
                                {percent(currentSimulation.max_drawdown_pct)}
                              </strong>
                            </div>
                            <div>
                              <small>Volatilidade anualizada¹</small>
                              <strong>
                                {percent(currentSimulation.volatility_pct)}
                              </strong>
                            </div>
                          </div>
                          <EquityChart curve={currentSimulation.curve} />
                          <p className="footnote">
                            ¹ Calculada sobre os retornos entre cotações
                            observadas; anualização aproximada de 252 pregões.
                            Aportes não são considerados ganhos. Resultados
                            passados não garantem resultados futuros.
                          </p>
                          <button
                            type="button"
                            className="text-danger"
                            disabled={busy}
                            onClick={() =>
                              action(
                                () =>
                                  catalog.deleteSimulation(
                                    currentSimulation.id,
                                  ),
                                'Simulação excluída.',
                              )
                            }
                          >
                            Excluir esta simulação
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}

            {page === 'series' && (
              <>
                <PageTitle
                  eyebrow="01 / DADOS"
                  title="Séries de preços"
                  description="Cadastre observações históricas por ativo. Uma cotação positiva por data; os valores podem ser fictícios para fins de demonstração."
                />
                <div className="two-columns">
                  <div className="panel">
                    <h3>{seriesEditId ? 'Editar série' : 'Nova série'}</h3>
                    <form onSubmit={saveSeries} className="form">
                      <label>
                        Nome
                        <input
                          required
                          minLength="2"
                          maxLength="100"
                          value={seriesForm.name}
                          onChange={(e) =>
                            setSeriesForm({
                              ...seriesForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Ex.: Índice de exemplo"
                        />
                      </label>
                      <label>
                        Símbolo
                        <input
                          required
                          pattern="[A-Za-z0-9._-]+"
                          value={seriesForm.symbol}
                          onChange={(e) =>
                            setSeriesForm({
                              ...seriesForm,
                              symbol: e.target.value,
                            })
                          }
                          placeholder="EXEMPLO"
                        />
                      </label>
                      <label>
                        Descrição
                        <textarea
                          value={seriesForm.description}
                          onChange={(e) =>
                            setSeriesForm({
                              ...seriesForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Fonte e natureza dos dados"
                        />
                      </label>
                      <div className="form-actions">
                        <button
                          disabled={busy}
                          className="primary"
                          type="submit"
                        >
                          {seriesEditId
                            ? 'Salvar alterações'
                            : 'Cadastrar série'}
                        </button>
                        {seriesEditId && (
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setSeriesEditId(null)
                              setSeriesForm(emptySeries)
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="panel">
                    <h3>
                      Séries disponíveis{' '}
                      <span className="count">{series.length}</span>
                    </h3>
                    {series.length === 0 ? (
                      <p className="empty">Nenhuma série cadastrada.</p>
                    ) : (
                      <div className="list">
                        {series.map((item) => (
                          <div
                            className={`list-item ${selectedSeries === item.id ? 'highlight' : ''}`}
                            key={item.id}
                          >
                            <button
                              type="button"
                              className="item-main"
                              onClick={() => setSelectedSeries(item.id)}
                            >
                              <strong>{item.symbol}</strong>
                              <span>{item.name}</span>
                              <small>{item.points.length} cotações</small>
                            </button>
                            <button
                              type="button"
                              className="icon-button"
                              aria-label={`Editar série ${item.symbol}`}
                              onClick={() => {
                                setSeriesEditId(item.id)
                                setSeriesForm({
                                  name: item.name,
                                  symbol: item.symbol,
                                  description: item.description,
                                })
                              }}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="icon-button danger"
                              aria-label={`Excluir série ${item.symbol}`}
                              disabled={busy}
                              onClick={() =>
                                action(
                                  () => catalog.deleteSeries(item.id),
                                  'Série excluída.',
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {currentSeries && (
                  <div className="panel space-top">
                    <div className="panel-heading">
                      <div>
                        <h3>Cotações · {currentSeries.symbol}</h3>
                        <p>
                          {currentSeries.description ||
                            'Sem descrição informada.'}
                        </p>
                      </div>
                      <span className="count">
                        {currentSeries.points.length} registros
                      </span>
                    </div>
                    <form className="inline-form" onSubmit={savePoint}>
                      <label>
                        Data
                        <input
                          required
                          type="date"
                          value={pointForm.day}
                          onChange={(e) =>
                            setPointForm({ ...pointForm, day: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Preço de fechamento
                        <input
                          required
                          type="number"
                          min="0.000001"
                          step="any"
                          value={pointForm.price}
                          onChange={(e) =>
                            setPointForm({
                              ...pointForm,
                              price: e.target.value,
                            })
                          }
                        />
                      </label>
                      <button type="submit" className="primary" disabled={busy}>
                        Adicionar cotação
                      </button>
                    </form>
                    {currentSeries.points.length === 0 ? (
                      <p className="empty">
                        Cadastre pelo menos duas datas para simular.
                      </p>
                    ) : (
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Preço</th>
                              <th>Ação</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSeries.points.map((point) => (
                              <tr key={point.id}>
                                <td>{dateBR(point.day)}</td>
                                <td>{money(point.price)}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="text-danger"
                                    disabled={busy}
                                    onClick={() =>
                                      action(
                                        () => catalog.deletePoint(point.id),
                                        'Cotação excluída.',
                                      )
                                    }
                                  >
                                    Excluir
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {page === 'strategies' && (
              <>
                <PageTitle
                  eyebrow="02 / REGRAS"
                  title="Estratégias"
                  description="Defina a alocação inicial e, se desejar, aportes no primeiro dia com cotação disponível de cada mês seguinte."
                />
                <div className="two-columns">
                  <div className="panel">
                    <h3>
                      {strategyEditId ? 'Editar estratégia' : 'Nova estratégia'}
                    </h3>
                    <form className="form" onSubmit={saveStrategy}>
                      <label>
                        Nome
                        <input
                          required
                          minLength="2"
                          value={strategyForm.name}
                          onChange={(e) =>
                            setStrategyForm({
                              ...strategyForm,
                              name: e.target.value,
                            })
                          }
                          placeholder="Ex.: Aporte todo mês"
                        />
                      </label>
                      <label>
                        Modalidade
                        <select
                          value={strategyForm.kind}
                          onChange={(e) =>
                            setStrategyForm({
                              ...strategyForm,
                              kind: e.target.value,
                              monthly_contribution:
                                e.target.value === 'buy_hold' ? '0' : '200',
                            })
                          }
                        >
                          <option value="buy_hold">Comprar e manter</option>
                          <option value="monthly_dca">Aporte mensal</option>
                        </select>
                      </label>
                      <label>
                        Capital inicial (R$)
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={strategyForm.initial_capital}
                          onChange={(e) =>
                            setStrategyForm({
                              ...strategyForm,
                              initial_capital: e.target.value,
                            })
                          }
                        />
                      </label>
                      {strategyForm.kind === 'monthly_dca' && (
                        <label>
                          Aporte mensal (R$)
                          <input
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={strategyForm.monthly_contribution}
                            onChange={(e) =>
                              setStrategyForm({
                                ...strategyForm,
                                monthly_contribution: e.target.value,
                              })
                            }
                          />
                        </label>
                      )}
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="primary"
                          disabled={busy}
                        >
                          {strategyEditId
                            ? 'Salvar alterações'
                            : 'Cadastrar estratégia'}
                        </button>
                        {strategyEditId && (
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setStrategyEditId(null)
                              setStrategyForm(emptyStrategy)
                            }}
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  <div className="panel">
                    <h3>
                      Estratégias cadastradas{' '}
                      <span className="count">{strategies.length}</span>
                    </h3>
                    {strategies.length === 0 ? (
                      <p className="empty">Nenhuma estratégia cadastrada.</p>
                    ) : (
                      <div className="list">
                        {strategies.map((item) => (
                          <div className="list-item" key={item.id}>
                            <div className="item-main">
                              <strong>{item.name}</strong>
                              <span>
                                {item.kind === 'buy_hold'
                                  ? 'Comprar e manter'
                                  : 'Aporte mensal'}
                              </span>
                              <small>
                                Inicial {money(item.initial_capital)}
                                {item.kind === 'monthly_dca'
                                  ? ` · Mensal ${money(item.monthly_contribution)}`
                                  : ''}
                              </small>
                            </div>
                            <button
                              type="button"
                              className="icon-button"
                              aria-label={`Editar estratégia ${item.name}`}
                              onClick={() => {
                                setStrategyEditId(item.id)
                                setStrategyForm({
                                  name: item.name,
                                  kind: item.kind,
                                  initial_capital: String(item.initial_capital),
                                  monthly_contribution: String(
                                    item.monthly_contribution,
                                  ),
                                })
                              }}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="icon-button danger"
                              aria-label={`Excluir estratégia ${item.name}`}
                              disabled={busy}
                              onClick={() =>
                                action(
                                  () => catalog.deleteStrategy(item.id),
                                  'Estratégia excluída.',
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {page === 'simulate' && (
              <>
                <PageTitle
                  eyebrow="03 / ANÁLISE"
                  title="Nova simulação"
                  description="Aplique uma estratégia a uma série histórica. O resultado fica salvo mesmo depois de atualizar a página."
                />
                <div className="two-columns">
                  <div className="panel">
                    <h3>Configurar período</h3>
                    {!series.length || !strategies.length ? (
                      <div className="empty">
                        Cadastre pelo menos uma série com duas cotações e uma
                        estratégia. Você também pode criar dados de exemplo na
                        Visão geral.
                      </div>
                    ) : (
                      <form className="form" onSubmit={simulate}>
                        <label>
                          Série
                          <select
                            required
                            value={simulationForm.series_id}
                            onChange={(e) =>
                              setSimulationForm({
                                ...simulationForm,
                                series_id: e.target.value,
                              })
                            }
                          >
                            {series.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.symbol} — {item.name} (
                                {item.points.length} cotações)
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Estratégia
                          <select
                            required
                            value={simulationForm.strategy_id}
                            onChange={(e) =>
                              setSimulationForm({
                                ...simulationForm,
                                strategy_id: e.target.value,
                              })
                            }
                          >
                            {strategies.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Data inicial
                          <input
                            required
                            type="date"
                            value={simulationForm.start_date}
                            onChange={(e) =>
                              setSimulationForm({
                                ...simulationForm,
                                start_date: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Data final
                          <input
                            required
                            type="date"
                            min={simulationForm.start_date}
                            value={simulationForm.end_date}
                            onChange={(e) =>
                              setSimulationForm({
                                ...simulationForm,
                                end_date: e.target.value,
                              })
                            }
                          />
                        </label>
                        <button
                          className="primary"
                          disabled={busy}
                          type="submit"
                        >
                          {busy ? 'Calculando...' : 'Executar simulação ↗'}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="panel explanation">
                    <div className="explanation-icon">↗</div>
                    <h3>Como calculamos</h3>
                    <p>
                      <strong>Comprar e manter:</strong> todo o capital compra
                      unidades na primeira cotação do intervalo.
                    </p>
                    <p>
                      <strong>Aporte mensal:</strong> a mesma compra inicial
                      recebe aportes na primeira cotação de cada mês seguinte.
                    </p>
                    <p>
                      Retorno é o valor final dividido pelo total aportado,
                      menos um. Queda máxima e volatilidade usam uma curva de
                      retorno sem confundir novos aportes com ganhos.
                    </p>
                    <p className="footnote">
                      Comparação educacional com preços informados pelo usuário.
                      Não representa recomendação de investimento ou custos,
                      impostos e dividendos.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function PageTitle({ eyebrow, title, description }) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}
