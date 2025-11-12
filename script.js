document.addEventListener('DOMContentLoaded',()=>{
    console.log('DOM carregado');

    const fileInput = document.getElementById('xmlInput')
    fileInput.addEventListener('change', function(event){

        console.log('Arquivo selecionado:', event.target.files[0].name);

        const mostrarBotao = document.getElementById('gerarXml');
        mostrarBotao.innerHTML = '<button id="gerar">Gerar Nota Fiscal</button>';

        document.getElementById('gerar').addEventListener('click',()=>{
            clearMain();

            if(event.target.files.length === 0){
                console.log('Nenhum arquivo selecionado!');
                return;
            }
            
            const arquivo = event.target.files[0];
            const leitor = new FileReader();
            
            leitor.onload = function(e){
                    
                const conteudo = e.target.result;
                console.log('Conteúdo do arquivo:', conteudo);
            }
        })

        clearMain = () =>{
            const main = document.querySelector('main');
            main.innerHTML = '';
            console.log('Elementos da tag main removidos!');
        }
    })
})
