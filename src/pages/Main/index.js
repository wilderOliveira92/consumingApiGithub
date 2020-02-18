import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/container/index';
import { Form, SubmitButton, List } from './styles';

class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        classError: false,
    };

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({
            loading: true,
        });
        const { newRepo, repositories } = this.state;

        try {
            const exists = repositories.map(repo => repo == newRepo);

            if (exists) {
                throw new Error('Repositório duplicado');
            }

            const response = await api.get(`/repos/${newRepo}`);

            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                classError: false,
            });
        } catch (error) {
            this.setState({
                classError: true,
            });
        } finally {
            this.setState({ loading: false });
        }
    };

    //carregar os dados do localstorage -- executa quando inicia o componete
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    //salvar os dados no localstorage -- executa na mudança de estado
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories != repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    render() {
        const { newRepo, loading, repositories, classError } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit} error={classError}>
                    <input
                        type="text"
                        placeholder="Adicionar Repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map(repo => (
                        <li key={repo.name}>
                            <span>{repo.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repo.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}

export default Main;
