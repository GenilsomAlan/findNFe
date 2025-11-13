document.addEventListener('DOMContentLoaded',()=>{
    //garante que o DOM esteja completamente carregado
    console.log('DOM carregado');

    const fileInput = document.getElementById('xmlInput')
    //seleciona o input de arquivo
    fileInput.addEventListener('change', function(event){
        //adiciona um listener para mudanças no input

        console.log('Arquivo selecionado:', event.target.files[0].name);
        //mostra o nome do arquivo selecionado no console

        const mostrarBotao = document.getElementById('gerarXml');
        mostrarBotao.innerHTML = '<button id="gerar">Gerar Nota Fiscal</button>';
        //adiciona o botão de gerar nota fiscal

        document.getElementById('gerar').addEventListener('click',()=>{

            clearMain(); //limpa o conteúdo da tag main

            if(event.target.files.length === 0){//verifica se algum arquivo foi selecionado
                console.log('Nenhum arquivo selecionado!');
                return;//sai da função se nenhum arquivo foi selecionado
            }
            
            const arquivo = event.target.files[0];//pega o primeiro arquivo selecionado
            const leitor = new FileReader();//faz a leitura do arquivo
            console.log('lendo o arquivo: ', arquivo.name);
            
            leitor.onload = function(e){//quando a leitura for concluída
                console.log('Arquivo lido com sucesso!');
                const conteudo = e.target.result;//pega o conteúdo lido

                const parser = new DOMParser();//cria um parser de XML
                const xmlDoc = parser.parseFromString(conteudo, "application/xml");//analisa o conteúdo como XML

                exibirNota(xmlDoc);//chama a função para exibir a nota fiscal
                
            }

            leitor.onerror = function(e){//em caso de erro na leitura
                console.error('Erro ao ler o arquivo:', e);
            }

            leitor.readAsText(arquivo);//lê o arquivo como texto
        })

        clearMain = () =>{
            const main = document.querySelector('main');//pega a tag main
            main.innerHTML = '';//substitui o conteúdo da tag main por vazio
            console.log('Elementos da tag main removidos!');
        }

        exibirNota = (xmlDoc) =>{
            const nomeEmitente = xmlDoc.getElementsByTagName('xNome')[0].textContent;
            const logradouroEmitente = xmlDoc.getElementsByTagName('xLgr')[0].textContent;
            const nro = xmlDoc.getElementsByTagName('nro')[0].textContent;
            const cpl = xmlDoc.getElementsByTagName('xCpl')[0]?.textContent || '';
            const bairroEmitente = xmlDoc.getElementsByTagName('xBairro')[0].textContent;
            const municipioEmitente = xmlDoc.getElementsByTagName('xMun')[0].textContent;
            const ufEmitente = xmlDoc.getElementsByTagName('UF')[0].textContent;
            const cepEmitente = xmlDoc.getElementsByTagName('CEP')[0].textContent;
            const foneEmitente = xmlDoc.getElementsByTagName('fone')[1].textContent;

            const nNF = xmlDoc.getElementsByTagName('nNF')[0].textContent;
            const serie = xmlDoc.getElementsByTagName('serie')[0].textContent;
            const tpNF = xmlDoc.getElementsByTagName('tpNF')[0].textContent;

            const keyAccess = xmlDoc.getElementsByTagName('chNFe')[0].textContent;

            const natOperacao = xmlDoc.getElementsByTagName('natOp')[0].textContent;
            const protocoloAltorizacaoUso = xmlDoc.getElementsByTagName('nProt')[0].textContent;
            const inscEstadual = xmlDoc.getElementsByTagName('IE')[0].textContent;
            //const inscMunicipal = xmlDoc.getElementsByTagName('IM')[0];
            //if(verificarElemento())
            //const inscEstadualSubst = xmlDoc.getElementsByTagName('IEST')[0];
           
            const cpfCnpj = xmlDoc.getElementsByTagName('CNPJ')[0]?.textContent || xmlDoc.getElementsByTagName('CPF')[0]?.textContent || '';
            

            const main = document.querySelector('main');//pega a tag main
            main.innerHTML = `
            <div class="sheetA4">
                <div class="headNFe">
                    <div class="idEmitente">
                        <div class="titleEmitente">
                            <p>IDENTIFICAÇÃO DO EMITENTE</p>
                        </div>
                        <div class="emitente">
                            <div class="endEmitente">
                                <h3>${nomeEmitente}</h3>
                                <P>${logradouroEmitente}, ${nro} - ${cpl}</P>
                                <p>${bairroEmitente} - ${cepEmitente}</p>
                                <p>${municipioEmitente}, ${ufEmitente} Fone/Fax: ${foneEmitente}</p>
                            </div> 
                        </div>
                    </div>
                    <div class="danfe">
                        <div class="tituloDanfe">
                            <h3>DANFE</h3>
                            <P>Documento Auxiliar da Nota Fiscal Eletronica</P>
                        </div>
                        <div class="serieNumerica">
                            <p>Nº ${nNF}</p>
                            <p>Série ${serie}</p>
                            <p>folha 1/1</p>
                        </div>
                        <div class="complemento">
                            <div class="inOut">
                                <p>0 - ENTRADA</p>
                                <p>1 - SAÍDA</p>
                            </div>
                            <div class="inOutNum">
                                <p>${tpNF}</p>
                            </div>
                        </div>
                    </div>
                    <div class="keyAccess">
                        <div class="barCode"></div>
                        <div class="keyAccessNum">
                            <p class="descricaoDoItem">CHAVE DE ACESSO</p>
                            <p class="textAlignCenter">${keyAccess}</p> 
                        </div>
                        <div class="dadosSefaz">
                            <p class="textSefaz">Consulta de autenticidade no portal nacional da NF-e</p>
                            <p class="textSefaz">www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora</p>
                        </div>
                    </div>
                </div>
                <div class="dataEmitente">
                    <div class="operacao">
                        <div class="natOperation">
                            <p class="descricaoDoItem">NATUREZA DA OPERAÇÃO</p>
                            <p class="textAlignCenter">${natOperacao}</p>
                        </div>
                        <div class="protocolAltorizationUse">
                            <p class="descricaoDoItem">PROTOCOLO DE AUTORIZAÇÃO DE USO</p>
                            <p class="textAlignCenter">${protocoloAltorizacaoUso}</p>
                        </div>
                    </div>
                    <div class="inscricoes">
                        <div class="inscEstadual">
                            <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL</p>
                            <p class="textAlignCenter">${inscEstadual}</p>
                        </div>
                        <div class="inscMunicipal">
                            <p class="descricaoDoItem">INSCRIÇÃO MUNICIPAL</p>
                            <p class="textAlignCenter">${inscMunicipal}</p>
                        </div>
                        <div class="inscEstadualSubst">
                            <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.</p>
                            <p class="textAlignCenter">${inscEstadualSubst}</p>
                        </div>
                        <div class="cpfCnpj">
                            <p class="descricaoDoItem">CNPJ / CPF</p>
                            <p class="textAlignCenter">${cpfCnpj}</p>
                        </div>
                    </div>
                </div>
                    <p>DESTINATÁRIO / REMETENTE</p>
                <div class="dataDestinatario">
                    <div class="linha1">
                        <div class="nome">
                            <p class="descricaoDoItem">NOME / RAZÃO SOCIAL</p>
                            <p class="txtAlignleft">Souza Cruz Ltda</p>
                        </div>
                        <div class="cnpjCpf">
                            <p class="descricaoDoItem">CNPJ / CPF</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="dateEmissao">
                            <p class="descricaoDoItem">DATA DA EMISSÃO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                    <div class="linha2">
                        <div class="endereco">
                            <p class="descricaoDoItem">ENDEREÇO</p>
                            <p class="txtAlignleft">RUA SIMAO ANTONIO, 1125</p>
                        </div>
                        <div class="bairro">
                            <p class="descricaoDoItem">BAIRRO / DISTRITO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="cep">
                            <p class="descricaoDoItem">CEP</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="dateSaida">
                            <p class="descricaoDoItem">DATA DA SAÍDA / ENTRADA</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                    <div class="linha3">
                        <div class="municipio">
                            <p class="descricaoDoItem">MUNICÍPIO</p>
                            <p class="txtAlignleft">CONTAGEM</p>
                        </div>
                        <div class="unidadeFederal">
                            <p class="descricaoDoItem">UF</p>
                            <p class="textAlignCenter">MG</p>
                        </div>
                        <div class="foneFax">
                            <p class="descricaoDoItem">FONE / FAX</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="inscEstadualDestinatario">
                            <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="horaSaida">
                            <p class="descricaoDoItem">HORA DA SAÍDA / ENTRADA</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                </div>
                    <p>CALCULO DO IMPOSTO</p>
                <div class="calculodoimposto">
                    <div class="linha4">
                        <div class="baseDeCalc">
                            <p class="descricaoDoItem">BASE DE CÁLC. DO ICMS</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorICMS">
                            <p class="descricaoDoItem">VALOR DO ICMS</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="baseICMS">
                            <p class="descricaoDoItem">BASE DE CÁLC. ICMS S.T.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorICMS">
                            <p class="descricaoDoItem">VALOR DO ICMS SUBST.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorImportacao">
                            <p class="descricaoDoItem">V. IMP. IMPORTAÇÃO</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorIcmsUfRemetente">
                            <p class="descricaoDoItem">V. ICMS UF REMET.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorFcpUfDestinatario">
                            <p class="descricaoDoItem">V. FCP UF DEST.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorTotalProdutos">
                            <p class="descricaoDoItem">V. TOTAL PRODUTOS</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                    </div>
                    <div class="linha5">
                        <div class="valorDoFrete">
                            <p class="descricaoDoItem">VALOR DO FRETE</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorDoSeguro">
                            <p class="descricaoDoItem">VALOR DO SEGURO</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="desconto">
                            <p class="descricaoDoItem">DESCONTO</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="outrasDespesas">
                            <p class="descricaoDoItem">OUTRAS DESPESAS</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorTotalIpi">
                            <p class="descricaoDoItem">VALOR TOTAL IPI</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorIcmsUfDestinatario">
                            <p class="descricaoDoItem">V. ICMS UF DEST.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorTotalTributo">
                            <p class="descricaoDoItem">V. TOT. TRIB.</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                        <div class="valorTotalNF">
                            <p class="descricaoDoItem">V. TOTAL DA NOTA</p>
                            <p class="textAlignRight">0,00</p>
                        </div>
                    </div>
                </div>
                <p>TRANSPORTADOR / VOLUMES TRANSPORTADOS</p>
                <div class="transportes">
                    <div class="linha6">
                        <div class="nomeTransportadora">
                            <p class="descricaoDoItem">NOME / RAZÃO SOCIAL</p>
                            <p class="txtAlignleft">SCAPINI TRANSPORTE E LOGISTICA LTDA</p>
                        </div>
                        <div class="frete">
                            <p class="descricaoDoItem">FRETE</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="codAntt">
                            <p class="descricaoDoItem">CÓDIGO ANTT</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="placaVeiculo">
                            <p class="descricaoDoItem">PLACA DO VEÍCULO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="unidadeFederalTransportadora">
                            <p class="descricaoDoItem">UF</p>
                            <p class="textAlignCenter">MG</p>
                        </div>
                        <div class="cpfCnpjTransportadora">
                            <p class="descricaoDoItem">CNPJ / CPF</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                    <div class="linha7">
                        <div class="enderecoTransportadora">
                            <p class="descricaoDoItem">ENDEREÇO</p>
                            <p class="txtAlignleft">AV ANTONIO THOMAZ FERREIRA 4667</p>
                        </div>
                        <div class="municipioTransportadora">
                            <p class="descricaoDoItem">MUNICÍPIO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="unidadeFederalEndereco">
                            <p class="descricaoDoItem">UF</p>
                            <p class="textAlignCenter">MG</p>
                        </div>
                        <div class="inscricaoEstadualTransportadora">
                            <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                    <div class="linha8">
                        <div class="quantidade">
                            <p class="descricaoDoItem">QUANTIDADE</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="especie">
                            <p class="descricaoDoItem">ESPECIE</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="marca">
                            <p class="descricaoDoItem">MARCA</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="numeracao">
                            <p class="descricaoDoItem">NUMERAÇÃO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="pesoBruto">
                            <p class="descricaoDoItem">PESO BRUTO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                        <div class="pesoLiquido">
                            <p class="descricaoDoItem">PESO LIQUIDO</p>
                            <p class="textAlignCenter">texto exemplo</p>
                        </div>
                    </div>
                </div>
                <p>DADOS DOS PRODUTOS / SERVIÇOS</p>
                <div class="dadosProdutoServico"></div>
                <p>DADOS ADICIONAIS</p>
                <div class="dadosAdicionais">
                    <div class="informacoesComplementares">
                        <p class="descricaoDoItem">INFORMAÇÕES COMPLEMENTARES</p>
                    </div>
                    <div class="reservadoAoFisco">
                        <p class="descricaoDoItem">RESERVADO AO FISCO</p>
                    </div>
                </div>
            </div>
            `
        }
    })
})
