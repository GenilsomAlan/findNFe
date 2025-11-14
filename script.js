document.addEventListener('DOMContentLoaded',()=>{
    //garante que o DOM esteja completamente carregado
    console.log('DOM carregado');

    const fileInput = document.getElementById('xmlInput')
    //seleciona o input de arquivo

    clearMain = () =>{
        const main = document.querySelector('main');//pega a tag main
        main.innerHTML = '';//substitui o conteúdo da tag main por vazio
        console.log('Elementos da tag main removidos!');
    }

    exibirNota = (xmlDoc) =>{
        //dados do emitente
        const nomeEmitente = verificar(xmlDoc, 'xNome', 0);
        const logradouroEmitente = xmlDoc.getElementsByTagName('xLgr')[0].textContent;
        const nro = xmlDoc.getElementsByTagName('nro')[0].textContent;
        const cpl = xmlDoc.getElementsByTagName('xCpl')[0]?.textContent || '';
        const bairroEmitente = xmlDoc.getElementsByTagName('xBairro')[0].textContent;
        const municipioEmitente = xmlDoc.getElementsByTagName('xMun')[0].textContent;
        const ufEmitente = xmlDoc.getElementsByTagName('UF')[0].textContent;
        const cepEmitente = xmlDoc.getElementsByTagName('CEP')[0].textContent;
        const foneEmitente = xmlDoc.getElementsByTagName('fone')[1].textContent;

        //dados da nota fiscal
        const nNF = xmlDoc.getElementsByTagName('nNF')[0].textContent;
        const serie = xmlDoc.getElementsByTagName('serie')[0].textContent;
        const tpNF = xmlDoc.getElementsByTagName('tpNF')[0].textContent;
        const keyAccess = xmlDoc.getElementsByTagName('chNFe')[0].textContent;

        //dados adicionais da nota fiscal
        const natOperacao = xmlDoc.getElementsByTagName('natOp')[0].textContent;
        const protocoloAltorizacaoUso = xmlDoc.getElementsByTagName('nProt')[0].textContent;
        const inscEstadual = xmlDoc.getElementsByTagName('IE')[0].textContent;
        const inscMunicipal = verificar(xmlDoc, 'IM', 0);
        const inscEstadualSubst = verificar(xmlDoc, 'IEST', 0);

        const cpfCnpjEmit = xmlDoc.getElementsByTagName('CNPJ')[1]?.textContent || xmlDoc.getElementsByTagName('CPF')[1].textContent;
            
        //dados do destinatário/remetente
        const nomeDest = xmlDoc.getElementsByTagName('xNome')[1].textContent;
        const cpfCnpjDest = xmlDoc.getElementsByTagName('CNPJ')[2]?.textContent || xmlDoc.getElementsByTagName('CPF')[2].textContent;
        const enderecoDest = xmlDoc.getElementsByTagName('xLgr')[1].textContent + ', ' + xmlDoc.getElementsByTagName('nro')[1].textContent + ' ' + (xmlDoc.getElementsByTagName('xCpl')[1]?.textContent || '');
        const bairroDest = xmlDoc.getElementsByTagName('xBairro')[1].textContent;
        const cepDest = xmlDoc.getElementsByTagName('CEP')[1].textContent;
        const municipioDest = xmlDoc.getElementsByTagName('xMun')[1].textContent;
        const ufDest = xmlDoc.getElementsByTagName('UF')[1].textContent;
        const foneFaxDest = xmlDoc.getElementsByTagName('fone')[2]?.textContent || '';
        const inscEstadualDest = verificar(xmlDoc, 'IE', 1);

        //datas e horas
        const dataEmissao = converterData(xmlDoc, 'dhEmi');
        const dataSaida = converterData(xmlDoc, 'dhSaiEnt');
        const horaSaida = converterData(xmlDoc, 'dhSaiEnt', 'hora');

        //dados do calculo do imposto
        const baseCalculo = xmlDoc.getElementsByTagName('vBC')[0].textContent || '0.00';
        const valorICMS = xmlDoc.getElementsByTagName('vICMS')[0].textContent || '0.00';
        const baseCalcICMS = verificar(xmlDoc, 'vBCST', 0) || '0.00';
        const valorICMSSubst = verificar(xmlDoc, 'vST', 0) || '0.00';
        const valorIMPImpor = verificar(xmlDoc, 'vImp', 0) || '0.00';
        const valorICMSUfRemet = verificar(xmlDoc, 'vICMSUFRemet', 0) || '0.00';
        const valorFCPUfDest = verificar(xmlDoc, 'vFCPUFDest', 0) || '0.00';
        const valorTotalProdutos = xmlDoc.getElementsByTagName('vProd')[0].textContent || '0.00';
        const valorDofrete = xmlDoc.getElementsByTagName('vFrete')[0].textContent || '0.00';
        const valorSeguro = xmlDoc.getElementsByTagName('vSeg')[0].textContent || '0.00';
        const descontos = xmlDoc.getElementsByTagName('vDesc')[0].textContent || '0.00';
        const outrasDespesas = xmlDoc.getElementsByTagName('vOutro')[0].textContent || '0.00';
        const valorTotalIPI = xmlDoc.getElementsByTagName('vIPI')[0].textContent || '0.00';
        const valorICMSUfDest = verificar(xmlDoc, 'vICMSUFDest', 0) || '0.00';
        const valorTotalTributo = verificar(xmlDoc, 'vTotTrib', 0) || '0.00';
        const valorTotalNotaFiscal = xmlDoc.getElementsByTagName('vNF')[0].textContent || '0.00';

        //dados do transportador/volumes transportados
        const nomeTranportadora = verificar(xmlDoc, 'xNome', 2);
        const respFret = verificar(xmlDoc, 'modFrete', 0);
        const codigoANTT = verificar(xmlDoc, 'cInt', 0);
        const placaVeiculo = verificar(xmlDoc, 'placa', 0);
        const ufTransportadora = verificar(xmlDoc, 'UF', 2);
        const cnpjCpfTransportadora = verificar(xmlDoc, 'CNPJ', 3) || verificar(xmlDoc, 'CPF', 3);
        const enderecoTransportadora = verificar(xmlDoc, 'xEnder', 0);
        const municipioTransportadora = verificar(xmlDoc, 'xMun', 2);
        const inscTransportadora = verificar(xmlDoc, 'IE', 2);
        const quantidadeVol = verificar(xmlDoc, 'qVol', 0) || '0';
        const especie = verificar(xmlDoc, 'esp', 0) || '';
        const marca = verificar(xmlDoc, 'marca', 0) || '';
        const numeracao = verificar(xmlDoc, 'nVol', 0) || '';
        const pesoBruto = verificar(xmlDoc, 'pesoB', 0) || '0';
        const pesoLiquido = verificar(xmlDoc, 'pesoL', 0) || '0';

        const infoComplementares = verificar(xmlDoc, 'infCpl', 0);
        const reservFisco = verificar(xmlDoc, 'infAdFisco', 0);


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
                    <div class="barCode">
                    <svg id="idBarCode"></svg>
                    </div>
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
                        <p class="textAlignCenter">${cpfCnpjEmit}</p>
                    </div>
                </div>
            </div>
            <div class="dataDestinatario">
                <div class="linha1">
                    <div class="nome">
                        <p class="descricaoDoItem">NOME / RAZÃO SOCIAL</p>
                        <p class="txtAlignleft">${nomeDest}</p>
                    </div>
                    <div class="cnpjCpf">
                        <p class="descricaoDoItem">CNPJ / CPF</p>
                        <p class="textAlignCenter">${cpfCnpjDest}</p>
                    </div>
                    <div class="dateEmissao">
                        <p class="descricaoDoItem">DATA DA EMISSÃO</p>
                        <p class="textAlignCenter">${dataEmissao}</p>
                    </div>
                </div>
                <div class="linha2">
                    <div class="endereco">
                        <p class="descricaoDoItem">ENDEREÇO</p>
                        <p class="txtAlignleft">${enderecoDest}</p>
                    </div>
                    <div class="bairro">
                        <p class="descricaoDoItem">BAIRRO / DISTRITO</p>
                        <p class="textAlignCenter">${bairroDest}</p>
                    </div>
                    <div class="cep">
                        <p class="descricaoDoItem">CEP</p>
                        <p class="textAlignCenter">${cepDest}</p>
                    </div>
                    <div class="dateSaida">
                        <p class="descricaoDoItem">DATA DA SAÍDA / ENTRADA</p>
                        <p class="textAlignCenter">${dataSaida}</p>
                    </div>
                </div>
                <div class="linha3">
                    <div class="municipio">
                        <p class="descricaoDoItem">MUNICÍPIO</p>
                        <p class="txtAlignleft">${municipioDest}</p>
                    </div>
                    <div class="unidadeFederal">
                        <p class="descricaoDoItem">UF</p>
                        <p class="textAlignCenter">${ufDest}</p>
                    </div>
                    <div class="foneFax">
                        <p class="descricaoDoItem">FONE / FAX</p>
                        <p class="textAlignCenter">${foneFaxDest}</p>
                    </div>
                    <div class="inscEstadualDestinatario">
                        <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL</p>
                        <p class="textAlignCenter">${inscEstadualDest}</p>
                    </div>
                    <div class="horaSaida">
                        <p class="descricaoDoItem">HORA DA SAÍDA / ENTRADA</p>
                        <p class="textAlignCenter">${horaSaida}</p>
                    </div>
                </div>
            </div>
            <div class="calculodoimposto">
                <div class="linha4">
                    <div class="baseDeCalc">
                        <p class="descricaoDoItem">BASE DE CÁLC. DO ICMS</p>
                        <p class="textAlignRight">${baseCalculo}</p>
                    </div>
                    <div class="valorICMS">
                        <p class="descricaoDoItem">VALOR DO ICMS</p>
                        <p class="textAlignRight">${valorICMS}</p>
                    </div>
                    <div class="baseICMS">
                        <p class="descricaoDoItem">BASE DE CÁLC. ICMS S.T.</p>
                        <p class="textAlignRight">${baseCalcICMS}</p>
                    </div>
                    <div class="valorICMS">
                        <p class="descricaoDoItem">VALOR DO ICMS SUBST.</p>
                        <p class="textAlignRight">${valorICMSSubst}</p>
                    </div>
                    <div class="valorImportacao">
                        <p class="descricaoDoItem">V. IMP. IMPORTAÇÃO</p>
                        <p class="textAlignRight">${valorIMPImpor}</p>
                    </div>
                    <div class="valorIcmsUfRemetente">
                        <p class="descricaoDoItem">V. ICMS UF REMET.</p>
                        <p class="textAlignRight">${valorICMSUfRemet}</p>
                    </div>
                    <div class="valorFcpUfDestinatario">
                        <p class="descricaoDoItem">V. FCP UF DEST.</p>
                        <p class="textAlignRight">${valorFCPUfDest}</p>
                    </div>
                    <div class="valorTotalProdutos">
                        <p class="descricaoDoItem">V. TOTAL PRODUTOS</p>
                        <p class="textAlignRight">${valorTotalProdutos}</p>
                    </div>
                </div>
                <div class="linha5">
                    <div class="valorDoFrete">
                        <p class="descricaoDoItem">VALOR DO FRETE</p>
                        <p class="textAlignRight">${valorDofrete}</p>
                    </div>
                    <div class="valorDoSeguro">
                        <p class="descricaoDoItem">VALOR DO SEGURO</p>
                        <p class="textAlignRight">${valorSeguro}</p>
                    </div>
                    <div class="desconto">
                        <p class="descricaoDoItem">DESCONTO</p>
                        <p class="textAlignRight">${descontos}</p>
                    </div>
                    <div class="outrasDespesas">
                        <p class="descricaoDoItem">OUTRAS DESPESAS</p>
                        <p class="textAlignRight">${outrasDespesas}</p>
                    </div>
                    <div class="valorTotalIpi">
                        <p class="descricaoDoItem">VALOR TOTAL IPI</p>
                        <p class="textAlignRight">${valorTotalIPI}</p>
                    </div>
                    <div class="valorIcmsUfDestinatario">
                        <p class="descricaoDoItem">V. ICMS UF DEST.</p>
                        <p class="textAlignRight">${valorICMSUfDest}</p>
                    </div>
                    <div class="valorTotalTributo">
                        <p class="descricaoDoItem">V. TOT. TRIB.</p>
                        <p class="textAlignRight">${valorTotalTributo}</p>
                    </div>
                    <div class="valorTotalNF">
                        <p class="descricaoDoItem">V. TOTAL DA NOTA</p>
                        <p class="textAlignRight">${valorTotalNotaFiscal}</p>
                    </div>
                </div>
            </div>
            <div class="transportes">
                <div class="linha6">
                    <div class="nomeTransportadora">
                        <p class="descricaoDoItem">NOME / RAZÃO SOCIAL</p>
                        <p class="txtAlignleft">${nomeTranportadora}</p>
                    </div>
                    <div class="frete">
                        <p class="descricaoDoItem">FRETE</p>
                        <p class="textAlignCenter">${respFret}</p>
                    </div>
                    <div class="codAntt">
                        <p class="descricaoDoItem">CÓDIGO ANTT</p>
                        <p class="textAlignCenter">${codigoANTT}</p>
                    </div>
                    <div class="placaVeiculo">
                        <p class="descricaoDoItem">PLACA DO VEÍCULO</p>
                        <p class="textAlignCenter">${placaVeiculo}</p>
                    </div>
                    <div class="unidadeFederalTransportadora">
                        <p class="descricaoDoItem">UF</p>
                        <p class="textAlignCenter">${ufTransportadora}</p>
                    </div>
                    <div class="cpfCnpjTransportadora">
                        <p class="descricaoDoItem">CNPJ / CPF</p>
                        <p class="textAlignCenter">${cnpjCpfTransportadora}</p>
                    </div>
                </div>
                <div class="linha7">
                    <div class="enderecoTransportadora">
                        <p class="descricaoDoItem">ENDEREÇO</p>
                        <p class="txtAlignleft">${enderecoTransportadora}</p>
                    </div>
                    <div class="municipioTransportadora">
                        <p class="descricaoDoItem">MUNICÍPIO</p>
                        <p class="textAlignCenter">${municipioTransportadora}</p>
                    </div>
                    <div class="unidadeFederalEndereco">
                        <p class="descricaoDoItem">UF</p>
                        <p class="textAlignCenter">${ufTransportadora}</p>
                    </div>
                    <div class="inscricaoEstadualTransportadora">
                        <p class="descricaoDoItem">INSCRIÇÃO ESTADUAL</p>
                        <p class="textAlignCenter">${inscTransportadora}</p>
                    </div>
                </div>
                <div class="linha8">
                    <div class="quantidade">
                        <p class="descricaoDoItem">QUANTIDADE</p>
                        <p class="textAlignCenter">${quantidadeVol}</p>
                    </div>
                    <div class="especie">
                        <p class="descricaoDoItem">ESPECIE</p>
                        <p class="textAlignCenter">${especie}</p>
                    </div>
                    <div class="marca">
                        <p class="descricaoDoItem">MARCA</p>
                        <p class="textAlignCenter">${marca}</p>
                    </div>
                    <div class="numeracao">
                        <p class="descricaoDoItem">NUMERAÇÃO</p>
                        <p class="textAlignCenter">${numeracao}</p>
                    </div>
                    <div class="pesoBruto">
                        <p class="descricaoDoItem">PESO BRUTO</p>
                        <p class="textAlignCenter">${pesoBruto}</p>
                    </div>
                    <div class="pesoLiquido">
                        <p class="descricaoDoItem">PESO LIQUIDO</p>
                        <p class="textAlignCenter">${pesoLiquido}</p>
                    </div>
                </div>
            </div>
            <div class="dadosProdutoServico"></div>
            <div class="dadosAdicionais">
                <div class="informacoesComplementares">
                    <p class="descricaoDoItem">Informações Complementares:</p>
                    <p class="textAlignLeft">Inf. Contribuinte: ${infoComplementares}</p>
                    <p class="textAlignLeft">Inf. Fisco: ${reservFisco}</p>
                </div>
                <div class="reservadoAoFisco">
                    <p class="descricaoDoItem">RESERVADO AO FISCO</p>
                    <p class="textAlignLeft"></p>
                </div>
            </div>
            <p class="assinatura">Feito por GG</p>
        </div>
        `
    }

    gerarCodigoBarras = (xmlDoc) =>{
        const keyAccess = xmlDoc.getElementsByTagName('chNFe')[0].textContent;
        JsBarcode("#idBarCode", String(keyAccess), {
            format: "CODE128",
            lineColor: "rgb(251, 60, 2)",
            width: 5.4,
            height: 50,
            flat: true,
            displayValue: false
        }).init();
    }

    exibirProdutos = (xmlDoc) =>{
        const produtos = xmlDoc.getElementsByTagName('det');
        const dadosProdutoServico = document.querySelector('.dadosProdutoServico');
        for(let i = 0; i < produtos.length; i++){
            const produto = produtos[i];
            const codProduto = produto.getElementsByTagName('cProd')[0].textContent;
            const descricao = produto.getElementsByTagName('xProd')[0].textContent;
            const ncm = produto.getElementsByTagName('NCM')[0].textContent;
            const origem = produto.getElementsByTagName('orig')[0].textContent;
            const cst = produto.getElementsByTagName('CST')[0].textContent;
            const cfop = produto.getElementsByTagName('CFOP')[0].textContent;
            const unidade = produto.getElementsByTagName('uCom')[0].textContent;
            const quantidade = produto.getElementsByTagName('qCom')[0].textContent;
            const valorUnitario = parseFloat(produto.getElementsByTagName('vUnCom')[0].textContent).toFixed(4);
            const valorTotal = produto.getElementsByTagName('vProd')[0].textContent;
            const valorDesc = produto.getElementsByTagName('vDesc')[0]?.textContent || '0.00';
            const baseCalculoICMS = produto.getElementsByTagName('vBC')[0].textContent;
            const valorICMS = produto.getElementsByTagName('vICMS')[0].textContent;
            const valorIPI = verificar(produto, 'vIPI', 0) || '0.00';
            const aliquotaICMS = produto.getElementsByTagName('pICMS')[0].textContent;
            const aliquotaIPI = verificar(produto, 'pIPI', 0) || '0.00';
            dadosProdutoServico.innerHTML += `
            <table class="tabelaProdutos">
                <tr>
                    <th class="cabecalhoTB">Codigo</th>
                    <th class="cabecalhoTB">Descrição do Produto / Serviço</th>
                    <th class="cabecalhoTB">NCM</th>
                    <th class='cabecalhoTB'>O/CST</th>
                    <th class="cabecalhoTB">CFOP</th>
                    <th class="cabecalhoTB">Un.</th>
                    <th class="cabecalhoTB">Quant.</th>
                    <th class="cabecalhoTB">Valor Un.</th>
                    <th class="cabecalhoTB">Valor Total</th>
                    <th class="cabecalhoTB">Valor Desc</th>
                    <th class="cabecalhoTB">B. C. ICMS</th>
                    <th class="cabecalhoTB">V. Icms</th>
                    <th class="cabecalhoTB">V. Ipi</th>
                    <th class="cabecalhoTB">Aliq. ICMS</th>
                    <th class="cabecalhoTB">Aliq. IPI</th>
                </tr>
                <tr>
                    <td class="celulaTB">${codProduto}</td>
                    <td class="celulaTB">${descricao}</td>
                    <td class="celulaTB">${ncm}</td>
                    <td class="celulaTB">${origem}/${cst}</td>
                    <td class="celulaTB">${cfop}</td>
                    <td class="celulaTB">${unidade}</td>
                    <td class="celulaTB">${quantidade}</td>
                    <td class="celulaTB">${valorUnitario}</td>
                    <td class="celulaTB">${valorTotal}</td>
                    <td class="celulaTB">${valorDesc}</td>
                    <td class="celulaTB">${baseCalculoICMS}</td>
                    <td class="celulaTB">${valorICMS}</td>
                    <td class="celulaTB">${valorIPI}</td>
                    <td class="celulaTB">${aliquotaICMS}</td>
                    <td class="celulaTB">${aliquotaIPI}</td>
                </tr>
            </table>
            `
        }
    }

    //função para verificar se o elemento existe dentro do XML
    verificar = (xmlDoc, elemento, indice) =>{
        if(xmlDoc.getElementsByTagName(elemento)[indice]){
            return xmlDoc.getElementsByTagName(elemento)[indice].textContent;
        }else{
            return '';
        }
    }
    //função para converter data e hora
    converterData = (xmlDoc, tag, tipo) =>{
        const dataHora = xmlDoc.getElementsByTagName(tag)[0].textContent;
        const data = new Date(dataHora);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');

        if(tipo === 'hora'){
            return `${hora}:${minutos}:${segundos}`;
        }else{
            return `${dia}/${mes}/${ano}`;
        }
    }

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
                exibirProdutos(xmlDoc);//chama a função para exibir os produtos
                gerarCodigoBarras(xmlDoc);

                console.log('Nota fiscal exibida com sucesso!');
                
            }

            leitor.onerror = function(e){//em caso de erro na leitura
                console.error('Erro ao ler o arquivo:', e);
            }

            leitor.readAsText(arquivo);//lê o arquivo como texto
        })
    })
})