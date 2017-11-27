% % % % % % % % % % % % % % % % % % % % % % % 
% Organiza os dados para visualização
% Desenvolvido por: Geovani Martins - 27/11/2017

%Inicialização
clc
clear 

%Configuração
filename_in = 'TAB_'; %diretorio dos dados
filename_out = 'td_outflows';

%Inputs
data_country_origin = {4,8,12,16,20,24,660,28,32,51,533,36,40,31,44,48,50,52,112,56,84,204,60,64,68,70,72,76,92,96,100,854,108,116,120,124,132,535,136,140,148,830,152,156,344,446,170,174,178,184,188,384,191,192,531,196,203,408,180,208,262,212,214,218,818,222,226,232,233,231,234,238,242,246,250,254,258,266,270,268,276,288,292,300,304,308,312,316,320,324,624,328,332,336,340,348,352,356,360,364,368,372,833,376,380,388,392,400,398,404,296,414,417,418,428,422,426,430,434,438,440,442,450,454,458,462,466,470,584,474,478,480,175,484,583,492,496,499,500,504,508,104,516,520,524,528,540,554,558,562,566,570,580,578,512,586,585,591,598,600,604,608,616,620,630,634,410,498,638,642,643,646,654,659,662,666,670,882,674,678,682,686,688,690,694,702,534,703,705,90,706,710,728,724,144,275,729,740,748,752,756,760,762,764,807,626,768,772,776,780,788,792,795,796,798,800,804,784,826,834,840,850,858,860,548,862,704,876,732,887,894,716};
data_country_dest = {108,174,262,232,231,404,450,454,480,175,508,638,646,690,706,728,800,834,894,716,24,120,140,148,178,180,226,266,678,12,818,434,504,729,788,732,72,426,516,710,748,204,854,132,384,270,288,324,624,430,466,478,562,566,654,686,694,768,398,417,762,795,860,156,344,446,408,392,496,410,96,116,360,418,458,104,608,702,764,626,704,4,50,64,356,364,462,524,586,144,51,31,48,196,268,368,376,400,414,422,512,634,682,275,760,792,784,887,112,100,203,348,616,498,642,643,703,804,830,208,233,234,246,352,372,833,428,440,578,752,826,8,20,70,191,292,300,336,380,470,499,620,674,688,705,724,807,40,56,250,276,438,442,492,528,756,660,28,533,44,52,535,92,136,192,531,212,214,308,312,332,388,474,500,630,659,662,670,534,780,796,850,84,188,222,320,340,484,558,591,32,68,76,152,170,218,238,254,328,600,604,740,858,862,60,124,304,666,840,36,554,242,540,598,90,548,316,296,584,583,520,580,585,16,184,258,570,882,772,776,798,876};
data_year = {1990, 1995, 2000, 2005, 2010, 2015};
header = {'cod_country_dest', 'cod_country_origin', 'total', 'year'};
%header = {'cod_country_dest', 'cod_country_origin', 'total'};

%Cabeçalho
textHeader = strjoin(header, ',');

%Escreve o cabeçalho
file_out = [filename_out,'.csv'];
fid = fopen(file_out,'w'); 
fprintf(fid,'%s\n',textHeader);
fclose(fid);

%Filtragem dos dados
for i = 1: length(data_year)
    %Carrega dados  
    file_in = dir([filename_in, num2str(data_year{i}),'.xlsx']);
    [~,~,data_file] = xlsread(file_in.name); % Read in your csv file to a cell array (input)

%     %Escreve o cabeçalho
%     file_out = [filename_out, num2str(data_year{i}),'.csv'];
%     fid = fopen(file_out,'w'); 
%     fprintf(fid,'%s\n',textHeader);
%     fclose(fid);
        
    new_data = [];
    for cd=1:length(data_country_dest)
        for co=1:length(data_country_origin)
            % This is a cell array of the new line you want to add
            total = data_file(cd, co);
            if cellfun(@isnan,total)
                total = 0;
            end            
            %new_data = [new_data; [data_country_dest(cd) data_country_origin(co) total]];
            new_data = [new_data; [data_country_dest(cd) data_country_origin(co) total data_year(i)]];
        end
    end
    
    dlmwrite(file_out, new_data, '-append');
     
    fprintf('Concluído: %s \n', file_out);
end



disp('Código executado com sucesso!');






